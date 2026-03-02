import { Request, Response } from 'express';
import User from '../models/User';
import Booking from '../models/Booking';
import Court from '../models/Court';
import { asyncHandler } from '../utils/asyncHandler';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getAdminStats = asyncHandler(async (req: Request, res: Response) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Parallel execution of all primary data points
    const [
        totalUsers,
        courtStats,
        bookingStatusStats,
        revenueData,
        monthlyGrowthData,
        todayAllBookings,
        recentBookings,
        currentlyActiveCourts
    ] = await Promise.all([
        User.countDocuments({ role: 'PLAYER' }),
        Court.aggregate([
            {
                $facet: {
                    total: [{ $count: "count" }],
                    active: [{ $match: { isActive: true } }, { $count: "count" }]
                }
            }
        ]),
        Booking.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]),
        Booking.aggregate([
            { $match: { status: { $in: ['CONFIRMED', 'COMPLETED'] } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]),
        Booking.aggregate([
            {
                $match: {
                    status: { $in: ['CONFIRMED', 'COMPLETED'] },
                    createdAt: { $gte: startOfLastMonth }
                }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $gte: ["$createdAt", startOfThisMonth] },
                            "thisMonth",
                            "lastMonth"
                        ]
                    },
                    total: { $sum: "$totalPrice" },
                    count: { $sum: 1 }
                }
            }
        ]),
        Booking.find({
            startTime: { $gte: startOfToday },
            status: { $ne: 'CANCELLED' }
        }).select('startTime status'),
        Booking.find()
            .populate('user', 'name email')
            .populate('court', 'name')
            .sort('-createdAt')
            .limit(8),
        Booking.distinct('court', {
            status: 'CONFIRMED',
            startTime: { $lte: now },
            endTime: { $gte: now }
        })
    ]);

    // Process Aggr Results
    const totalCourts = courtStats[0].total[0]?.count || 0;
    const activeCourts = currentlyActiveCourts.length;
    const operationalCourts = courtStats[0].active[0]?.count || 0;

    const statusMap = bookingStatusStats.reduce((acc: any, curr) => {
        acc[curr._id] = curr.count;
        return acc;
    }, {});

    const totalRevenue = revenueData[0]?.total || 0;

    const thisMonthData = monthlyGrowthData.find(d => d._id === 'thisMonth') || { total: 0, count: 0 };
    const lastMonthData = monthlyGrowthData.find(d => d._id === 'lastMonth') || { total: 0, count: 0 };

    // Revenue growth logic
    let revenueGrowth = "0%";
    if (lastMonthData.total > 0) {
        const growth = ((thisMonthData.total - lastMonthData.total) / lastMonthData.total) * 100;
        revenueGrowth = `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
    } else if (thisMonthData.total > 0) {
        revenueGrowth = "+100%";
    }

    // Hourly distribution for today (8h - 22h)
    const hourlyStats: number[] = Array(15).fill(0);
    todayAllBookings.forEach(b => {
        const h = new Date(b.startTime).getHours();
        if (h >= 8 && h <= 22) {
            hourlyStats[h - 8]++;
        }
    });

    // Peak hour
    const maxBookingsInHour = Math.max(...hourlyStats, 0);
    const peakIdx = hourlyStats.indexOf(maxBookingsInHour);
    const peakHours = maxBookingsInHour > 0 ? `${8 + peakIdx}h - ${9 + peakIdx}h` : 'Aucun';

    // Today stats
    const todayBookings = todayAllBookings.length;
    const occupancyToday = (activeCourts > 0 && todayBookings > 0)
        ? Math.round((todayBookings / (activeCourts * 15)) * 100)
        : 0;

    // Changes for other KPIs
    const newUsersceMois = await User.countDocuments({ role: 'PLAYER', createdAt: { $gte: startOfThisMonth } });
    const courtScore = totalCourts > 0 ? Math.round((activeCourts / totalCourts) * 100) : 0;

    res.status(200).json({
        success: true,
        data: {
            totalRevenue,
            revenueThisMonth: thisMonthData.total,
            userCount: totalUsers,
            courtCount: totalCourts,
            activeCourts,
            operationalCourts,
            bookingCount: Object.values(statusMap).reduce((a: any, b: any) => a + b, 0),
            todayBookings,
            confirmedCount: statusMap['CONFIRMED'] || 0,
            pendingCount: statusMap['PENDING'] || 0,
            cancelledCount: statusMap['CANCELLED'] || 0,
            completedCount: statusMap['COMPLETED'] || 0,
            occupancyToday,
            recentBookings,
            hourlyStats,
            peakHours,
            changes: {
                revenue: revenueGrowth,
                users: `+${newUsersceMois} ce mois`,
                bookings: `+${thisMonthData.count}`,
                courts: `${operationalCourts}/${totalCourts}`
            }
        }
    });
});

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find({ role: 'PLAYER' }).sort('-createdAt');
    res.status(200).json({ success: true, count: users.length, data: users });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting admin
    if (user.role === 'ADMIN') {
        return res.status(400).json({ message: 'Cannot delete an admin user' });
    }

    await user.deleteOne();

    res.status(200).json({ success: true, data: {} });
});

// @desc    Update user details
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Prevent cross-admin editing to maintain hierarchy (simple rule)
    if (user.role === 'ADMIN' && req.params.id !== (req as any).user.id) {
        return res.status(403).json({ message: 'Cannot edit another admin' });
    }

    const { name, email, role, phone, address } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    const updatedUser = await user.save();

    res.status(200).json({
        success: true,
        data: updatedUser
    });
});
