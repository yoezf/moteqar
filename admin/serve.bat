@echo off
rem Starts the admin at http://localhost:8088/admin
set PHP_INI_SCAN_DIR=%~dp0php-ext
php "%~dp0artisan" serve --host=127.0.0.1 --port=8088
