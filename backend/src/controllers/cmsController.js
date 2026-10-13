const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getSettings = async (req, res, next) => {
  try {
    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const settingsMap = {};
      mock.tables.site_settings.forEach(s => {
        settingsMap[s.key_name] = s.key_value;
      });
      return res.json({ success: true, data: settingsMap, list: mock.tables.site_settings });
    }

    const [rows] = await db.query('SELECT key_name, key_value, category, description FROM site_settings');
    const settingsMap = {};
    (rows || []).forEach(r => {
      settingsMap[r.key_name] = r.key_value;
    });

    res.json({ success: true, data: settingsMap, list: rows });
  } catch (err) {
    next(err);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const settings = req.body; // e.g. { site_name: '...', church_name: '...' }

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      Object.keys(settings).forEach(key => {
        const existing = mock.tables.site_settings.find(s => s.key_name === key);
        if (existing) {
          existing.key_value = settings[key];
        } else {
          mock.tables.site_settings.push({
            key_name: key,
            key_value: settings[key],
            category: 'GENERAL'
          });
        }
      });
      return res.json({ success: true, message: 'Settings updated successfully.' });
    }

    for (const [key, value] of Object.entries(settings)) {
      await db.query(`
        INSERT INTO site_settings (key_name, key_value, category)
        VALUES (?, ?, 'GENERAL')
        ON DUPLICATE KEY UPDATE key_value = VALUES(key_value)
      `, [key, String(value)]);
    }

    res.json({ success: true, message: 'Settings updated successfully.' });
  } catch (err) {
    next(err);
  }
};

exports.getFaqs = async (req, res, next) => {
  try {
    if (db.isMock()) {
      const mock = require('../config/mockDb');
      return res.json({ success: true, data: mock.tables.faqs });
    }

    const [faqs] = await db.query('SELECT * FROM faqs WHERE is_active = TRUE ORDER BY sort_order ASC');
    res.json({ success: true, data: faqs });
  } catch (err) {
    next(err);
  }
};

exports.getSuccessStories = async (req, res, next) => {
  try {
    if (db.isMock()) {
      const mock = require('../config/mockDb');
      return res.json({ success: true, data: mock.tables.success_stories.filter(s => s.is_published) });
    }

    const [stories] = await db.query('SELECT * FROM success_stories WHERE is_published = TRUE ORDER BY created_at DESC');
    res.json({ success: true, data: stories });
  } catch (err) {
    next(err);
  }
};

exports.createSuccessStory = async (req, res, next) => {
  try {
    const { couple_names, groom_name, bride_name, marriage_date, wedding_photo_url, story, church_blessing_notes } = req.body;
    const id = uuidv4();

    const photo = wedding_photo_url || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80';

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const item = {
        id,
        couple_names: couple_names || `${groom_name || 'Groom'} & ${bride_name || 'Bride'}`,
        groom_name: groom_name || couple_names?.split('&')[0]?.trim() || '',
        bride_name: bride_name || couple_names?.split('&')[1]?.trim() || '',
        marriage_date: marriage_date || new Date().toISOString().split('T')[0],
        wedding_photo_url: photo,
        story: story || 'Blessed through church matrimonial ministry.',
        church_blessing_notes: church_blessing_notes || 'Solemnized with blessings at The Open Door Church main sanctuary.',
        is_published: true,
        created_at: new Date()
      };
      mock.tables.success_stories.unshift(item);
      return res.status(201).json({ success: true, message: 'Success story added successfully.', data: item });
    }

    await db.query(`
      INSERT INTO success_stories (id, couple_names, groom_name, bride_name, marriage_date, wedding_photo_url, story, church_blessing_notes, is_published, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE, NOW())
    `, [id, couple_names, groom_name, bride_name, marriage_date, photo, story, church_blessing_notes]);

    res.status(201).json({ success: true, message: 'Success story created successfully.' });
  } catch (err) {
    next(err);
  }
};

exports.updateSuccessStory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { couple_names, groom_name, bride_name, marriage_date, wedding_photo_url, story, church_blessing_notes, is_published } = req.body;

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const item = mock.tables.success_stories.find(s => s.id === id);
      if (!item) return res.status(404).json({ success: false, message: 'Success story not found.' });

      if (couple_names !== undefined) item.couple_names = couple_names;
      if (groom_name !== undefined) item.groom_name = groom_name;
      if (bride_name !== undefined) item.bride_name = bride_name;
      if (marriage_date !== undefined) item.marriage_date = marriage_date;
      if (wedding_photo_url !== undefined) item.wedding_photo_url = wedding_photo_url;
      if (story !== undefined) item.story = story;
      if (church_blessing_notes !== undefined) item.church_blessing_notes = church_blessing_notes;
      if (is_published !== undefined) item.is_published = is_published;

      return res.json({ success: true, message: 'Success story updated successfully.', data: item });
    }

    await db.query(`
      UPDATE success_stories 
      SET couple_names = COALESCE(?, couple_names),
          groom_name = COALESCE(?, groom_name),
          bride_name = COALESCE(?, bride_name),
          marriage_date = COALESCE(?, marriage_date),
          wedding_photo_url = COALESCE(?, wedding_photo_url),
          story = COALESCE(?, story),
          church_blessing_notes = COALESCE(?, church_blessing_notes),
          is_published = COALESCE(?, is_published)
      WHERE id = ?
    `, [couple_names, groom_name, bride_name, marriage_date, wedding_photo_url, story, church_blessing_notes, is_published, id]);

    res.json({ success: true, message: 'Success story updated successfully.' });
  } catch (err) {
    next(err);
  }
};

exports.deleteSuccessStory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const idx = mock.tables.success_stories.findIndex(s => s.id === id);
      if (idx !== -1) {
        mock.tables.success_stories.splice(idx, 1);
      }
      return res.json({ success: true, message: 'Success story deleted successfully.' });
    }

    await db.query('DELETE FROM success_stories WHERE id = ?', [id]);
    res.json({ success: true, message: 'Success story deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
