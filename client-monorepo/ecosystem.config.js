const path = require('path');

module.exports = {
  apps: [{
    name: 'website-ssr',
    cwd: __dirname,
    script: path.join(__dirname, 'dist/apps/website/server/server.mjs'),
    instances: 2,
    exec_mode: 'cluster',
    sticky: true,
    env: {
      NODE_ENV: 'development',
      PORT: 4000,
      // Debugging variables
      DEBUG: 'express:*,error,*:error',
      NODE_DEBUG: 'module,http,cluster,net',
      // Path configuration
      NX_WORKSPACE_ROOT: __dirname,
      NX_APP: 'website',
      DIST_FOLDER: path.join(__dirname, 'dist/apps/website'),
      BROWSER_FOLDER: path.join(__dirname, 'dist/apps/website/browser'),
      // Node path resolution
      NODE_PATH: [
        path.join(__dirname, 'node_modules')
      ].join(path.delimiter)
    },
    // Enhanced logging
    log_file: 'logs/combined.log',
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    // Add node args for debugging
    node_args: [
      '--inspect=9229',
      '--trace-warnings', // Show stack traces for process warnings
      '--unhandled-rejections=strict' // Make unhandled promise rejections crash
    ],
    // Additional PM2 options for debugging
    watch: false, // Set to true if you want to watch for file changes
    ignore_watch: ['node_modules', 'logs'], // Ignore these paths if watching
    max_memory_restart: '1G', // Restart if memory exceeds 1GB
    min_uptime: '5s', // Consider app stable after 5 seconds
    listen_timeout: 5000 // Increase wait time for app to listen
  }]
};
