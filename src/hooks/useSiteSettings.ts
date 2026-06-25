import { useState, useEffect } from 'react';
import api from '../lib/api';

export interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  availability: string;
  googleMapsUrl: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
  };
}

const defaultSettings: SiteSettings = {
  phone: '06 95 59 04 49',
  email: 'contact@padelarena.fr',
  address: '123 Avenue du Padel, 41100 Vendôme',
  availability: '08:00 — 23:00, Sept jours sur sept',
  googleMapsUrl: 'https://maps.google.com',
  socialLinks: {
    instagram: '#',
    facebook: '#',
    twitter: '#'
  }
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/content/settings');
      if (res.data.data) {
        setSettings(res.data.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings: settings || defaultSettings, loading, error, refresh: fetchSettings };
};
