@echo off
rem Runs artisan with the SQLite extension enabled for this project only (no change to the system php.ini).
set PHP_INI_SCAN_DIR=%~dp0php-ext
php "%~dp0artisan" %*
