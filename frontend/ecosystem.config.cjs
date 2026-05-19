/**
 * PM2 Ecosystem Configuration — Smart Mysłowice
 *
 * Użycie:
 *   pm2 start ecosystem.config.cjs        # uruchom
 *   pm2 save                               # zapisz listę procesów (dla pm2 resurrect)
 *   pm2 startup                            # generuj skrypt systemd do autostartu
 *   pm2 logs smart-myslowice               # podgląd logów
 *   pm2 restart smart-myslowice            # restart
 */

module.exports = {
  apps: [
    {
      name: 'smart-myslowice',
      script: 'server.js',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
      },
      env_file: '.env',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: 'logs/error.log',
      out_file: 'logs/out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
