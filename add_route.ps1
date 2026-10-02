$route = "    Route::delete(`"/trah-settings/image/{field}`", [TrahSettingsController::class, `"deleteImage`"])->name(`"trah-settings.delete-image`");"
Add-Content -Path "d:\data pribadi\project\TrahPanembahanSenopati\patrapsenopati\routes\web.php" -Value $route
Write-Host "Route added!"