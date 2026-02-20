// controllers/systemController.js
import db from '../config/database.js';

/* ===========================
   GET /api/system/settings
=========================== */
export const getAllSettings = async (req, res) => {
  try {
    const settings = await db.getMany('SELECT * FROM system_settings ORDER BY setting_key');
    
    // Convert to key-value object
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.setting_key] = setting.setting_value;
    });
    
    res.json({ success: true, data: settingsObj });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   GET /api/system/settings/:key
=========================== */
export const getSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;
    
    const setting = await db.getOne(
      'SELECT * FROM system_settings WHERE setting_key = $1',
      [key]
    );
    
    if (!setting) {
      return res.status(404).json({ success: false, message: 'Setting not found' });
    }
    
    res.json({ success: true, data: setting });
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   PUT /api/system/settings/:key
=========================== */
export const updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value, updated_by } = req.body;
    
    if (value === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Setting value is required' 
      });
    }
    
    // Check if setting exists
    const existing = await db.getOne(
      'SELECT setting_id FROM system_settings WHERE setting_key = $1',
      [key]
    );
    
    if (existing) {
      // Update existing setting
      await db.update(
        `UPDATE system_settings 
         SET setting_value = $1, updated_by = $2
         WHERE setting_key = $3`,
        [value, updated_by || 'admin', key]
      );
    } else {
      // Insert new setting
      await db.insert(
        `INSERT INTO system_settings (setting_key, setting_value, updated_by)
         VALUES ($1, $2, $3)`,
        [key, value, updated_by || 'admin']
      );
    }
    
    res.json({ success: true, message: 'Setting updated successfully' });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   POST /api/system/maintenance/toggle
=========================== */
export const toggleMaintenanceMode = async (req, res) => {
  try {
    const { enabled, message, updated_by } = req.body;
    
    // Update maintenance mode
    await db.update(
      `UPDATE system_settings 
       SET setting_value = $1, updated_by = $2
       WHERE setting_key = 'maintenance_mode'`,
      [enabled ? 'true' : 'false', updated_by || 'admin']
    );
    
    // Update maintenance message if provided
    if (message) {
      await db.update(
        `UPDATE system_settings 
         SET setting_value = $1, updated_by = $2
         WHERE setting_key = 'maintenance_message'`,
        [message, updated_by || 'admin']
      );
    }
    
    res.json({ 
      success: true, 
      message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'} successfully`,
      data: { maintenance_mode: enabled }
    });
  } catch (error) {
    console.error('Toggle maintenance mode error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ===========================
   GET /api/system/maintenance/status
=========================== */
export const getMaintenanceStatus = async (req, res) => {
  try {
    const modeSetting = await db.getOne(
      'SELECT setting_value FROM system_settings WHERE setting_key = $1',
      ['maintenance_mode']
    );
    
    const messageSetting = await db.getOne(
      'SELECT setting_value FROM system_settings WHERE setting_key = $1',
      ['maintenance_message']
    );
    
    res.json({ 
      success: true, 
      data: {
        enabled: modeSetting?.setting_value === 'true',
        message: messageSetting?.setting_value || 'We are currently updating our inventory. Please check back soon!'
      }
    });
  } catch (error) {
    console.error('Get maintenance status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
