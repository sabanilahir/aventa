<?php

use App\Http\Controllers\GuestRegisterController;

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\UserFileController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\SettingAppController;
use App\Http\Controllers\MediaFolderController;
use App\Http\Controllers\DashboardUserController;
use App\Http\Controllers\FaceVerificationController;
use App\Http\Controllers\FaceRegisterController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\WaSettingController;
use App\Http\Controllers\TamuController;
use App\Http\Controllers\HadiahController;
use App\Http\Controllers\SouvenirController;
use App\Http\Controllers\MejaController;
use App\Http\Controllers\GrupController;
use App\Http\Controllers\PertanyaanController;
use App\Http\Controllers\GuestSettingController;
use App\Http\Controllers\CheckInController;
use App\Http\Controllers\GuestDashboardPageController;
use App\Http\Controllers\BroadcastController;
use App\Http\Controllers\QrCodeController;
use Illuminate\Support\Facades\Route;
// Guest Registration (Public - tanpa login)
Route::get("/register/{token}", [GuestRegisterController::class, "show"])->name("guest.register");
Route::post("/guest/register/simpan", [GuestRegisterController::class, "store"])->name("guest.register.store");

use Illuminate\Support\Facades\Redirect;
Route::get("/", fn() => Redirect::to("/dashboard"))->name("home");
Route::withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class])->group(function () {
    Route::post("/logout", [App\Http\Controllers\Auth\AuthenticatedSessionController::class, "destroy"])->name("logout");
    Route::post("/face-api/register", [FaceVerificationController::class, "registerFace"]);
    Route::get("/face-api/status", [FaceVerificationController::class, "checkFaceStatus"]);
    Route::delete("/face-api/delete", [FaceVerificationController::class, "deleteFace"]);
    Route::post("/wa-settings/test-connection", [WaSettingController::class, "testConnection"]);
    Route::post("/wa-settings/test-send", [WaSettingController::class, "testSend"]);
    Route::post("/guest/register/simpan", [GuestRegisterController::class, "store"]);
Route::withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class])->group(function () {
    Route::post("/logout", [App\Http\Controllers\Auth\AuthenticatedSessionController::class, "destroy"])->name("logout");
    Route::post("/face-api/register", [FaceVerificationController::class, "registerFace"]);
    Route::get("/face-api/status", [FaceVerificationController::class, "checkFaceStatus"]);
    Route::delete("/face-api/delete", [FaceVerificationController::class, "deleteFace"]);
    Route::post("/guest/register/simpan", [GuestRegisterController::class, "store"]);
Route::get("/face-register", [FaceRegisterController::class, "index"])->name("face.register.page");
Route::post("/logout", [AuthenticatedSessionController::class, "destroy"])->name("logout");
Route::middleware(["auth"])->group(function () {
    Route::get("/dashboard", [DashboardUserController::class, "index"])->name("dashboard");
    Route::get("/menus", [MenuController::class, "index"])->name("menus.index");
    Route::get("/menus/create", [MenuController::class, "create"])->name("menus.create");
    Route::post("/menus", [MenuController::class, "store"])->name("menus.store");
    Route::get("/menus/{menu}/edit", [MenuController::class, "edit"])->name("menus.edit");
    Route::put("/menus/{menu}", [MenuController::class, "update"])->name("menus.update");
    Route::delete("/menus/{menu}", [MenuController::class, "destroy"])->name("menus.destroy");
    Route::post("/menus/reorder", [MenuController::class, "reorder"])->name("menus.reorder");
    Route::get("/users", [UserController::class, "index"])->name("users.index");
    Route::get("/users/create", [UserController::class, "create"])->name("users.create");
    Route::post("/users", [UserController::class, "store"])->name("users.store");
    Route::get("/users/{user}/edit", [UserController::class, "edit"])->name("users.edit");
    Route::put("/users/{user}", [UserController::class, "update"])->name("users.update");
    Route::delete("/users/{user}", [UserController::class, "destroy"])->name("users.destroy");
    Route::put("/users/{user}/password", [UserController::class, "updatePassword"])->name("users.password");
    Route::get("/roles", [RoleController::class, "index"])->name("roles.index");
    Route::get("/roles/create", [RoleController::class, "create"])->name("roles.create");
    Route::post("/roles", [RoleController::class, "store"])->name("roles.store");
    Route::get("/roles/{role}/edit", [RoleController::class, "edit"])->name("roles.edit");
    Route::put("/roles/{role}", [RoleController::class, "update"])->name("roles.update");
    Route::delete("/roles/{role}", [RoleController::class, "destroy"])->name("roles.destroy");
    Route::get("/permissions", [PermissionController::class, "index"])->name("permissions.index");
    Route::get("/permissions/create", [PermissionController::class, "create"])->name("permissions.create");
    Route::post("/permissions", [PermissionController::class, "store"])->name("permissions.store");
    Route::get("/permissions/{permission}/edit", [PermissionController::class, "edit"])->name("permissions.edit");
    Route::put("/permissions/{permission}", [PermissionController::class, "update"])->name("permissions.update");
    Route::delete("/permissions/{permission}", [PermissionController::class, "destroy"])->name("permissions.destroy");
    Route::get("/setting-app", [SettingAppController::class, "edit"])->name("setting-app.edit");
    Route::post("/setting-app", [SettingAppController::class, "update"])->name("setting-app.update");
    Route::post("/setting-app/upload", [SettingAppController::class, "upload"])->name("setting-app.upload");
    Route::get("/backups", [BackupController::class, "index"])->name("backups.index");
    Route::post("/backups", [BackupController::class, "store"])->name("backups.store");
    Route::get("/backups/download/{filename}", [BackupController::class, "download"])->name("backups.download");
    Route::delete("/backups/{filename}", [BackupController::class, "destroy"])->name("backups.destroy");
    Route::get("/audit-logs", [AuditLogController::class, "index"])->name("audit-logs.index");
    Route::get("/user-files", [UserFileController::class, "index"])->name("user-files.index");
    Route::post("/user-files", [UserFileController::class, "store"])->name("user-files.store");
    Route::delete("/user-files/{userFile}", [UserFileController::class, "destroy"])->name("user-files.destroy");
    Route::get("/media-folders", [MediaFolderController::class, "index"])->name("media-folders.index");
    Route::post("/media-folders", [MediaFolderController::class, "store"])->name("media-folders.store");
    Route::delete("/media-folders/{mediaFolder}", [MediaFolderController::class, "destroy"])->name("media-folders.destroy");
    Route::get("/events", [EventController::class, "index"])->name("events.index");
    Route::get("/events/create", [EventController::class, "create"])->name("events.create");
    Route::get("/events/{id}", [EventController::class, "show"])->name("events.show");
    Route::post("/events", [EventController::class, "store"])->name("events.store");
    Route::get("/events/{id}/edit", [EventController::class, "edit"])->name("events.edit");
    Route::put("/events/{id}", [EventController::class, "update"])->name("events.update");
    Route::delete("/events/{id}", [EventController::class, "destroy"])->name("events.destroy");
    Route::get("/wa-settings", [WaSettingController::class, "index"])->name("wa-settings.index");
    Route::post("/wa-settings", [WaSettingController::class, "store"])->name("wa-settings.store");
    Route::post("/broadcast/send", [BroadcastController::class, "send"])->name("broadcast.send");
    Route::get("/broadcast", [BroadcastController::class, "index"])->name("broadcast.index");


    Route::get("/qr", [QrCodeController::class, "index"])->name("qr.index");
    Route::get("/qr", [QrCodeController::class, "index"])->name("qr.index");
    Route::post("/qr/generate-all", [QrCodeController::class, "generateAll"])->name("qr.generate-all");
    Route::get("/qr/api/{tamu}", [QrCodeController::class, "getQrcodes"])->name("qr.get-qrcodes");
    Route::get("/qr/download/{tamu}", [QrCodeController::class, "download"])->name("qr.download");
    });
    Route::prefix("guest")->name("guest.")->group(function () {
        Route::get("/", [GuestDashboardPageController::class, "index"])->name("dashboard");
        Route::get("/tamu", [TamuController::class, "index"])->name("tamu.index");
        Route::get("/tamu", [TamuController::class, "index"])->name("tamu.index");
        Route::get("/tamu/{tamu}", [TamuController::class, "show"])->name("tamu.show");
        Route::get("/tamu/{tamu}/edit", [TamuController::class, "edit"])->name("tamu.edit");
        Route::get("/tamu/create", [TamuController::class, "create"])->name("tamu.create");
        Route::post("/tamu", [TamuController::class, "store"])->name("tamu.store");
        Route::get("/tamu/{tamu}/edit", [TamuController::class, "edit"])->name("tamu.edit");
        Route::delete("/tamu/{tamu}", [TamuController::class, "destroy"])->name("tamu.destroy");
        Route::post("/tamu/{tamu}/checkin", [CheckInController::class, "checkin"])->name("tamu.checkin");
        Route::get("/tamu/export", [TamuController::class, "export"])->name("tamu.export");
        Route::put("/tamu/{tamu}", [TamuController::class, "update"])->name("tamu.update");
        Route::delete("/tamu/{tamu}", [TamuController::class, "destroy"])->name("tamu.destroy");
        Route::get("/tamu/export", [TamuController::class, "export"])->name("tamu.export");
        Route::post("/tamu/import", [TamuController::class, "import"])->name("tamu.import");
        Route::get("/hadiah", [HadiahController::class, "index"])->name("hadiah.index");
        Route::get("/hadiah/create", [HadiahController::class, "create"])->name("hadiah.create");
        Route::post("/hadiah", [HadiahController::class, "store"])->name("hadiah.store");
        Route::get("/hadiah/{hadiah}/edit", [HadiahController::class, "edit"])->name("hadiah.edit");
        Route::put("/hadiah/{hadiah}", [HadiahController::class, "update"])->name("hadiah.update");
        Route::delete("/hadiah/{hadiah}", [HadiahController::class, "destroy"])->name("hadiah.destroy");
        Route::get("/souvenir", [SouvenirController::class, "index"])->name("souvenir.index");
        Route::get("/souvenir/create", [SouvenirController::class, "create"])->name("souvenir.create");
        Route::post("/souvenir", [SouvenirController::class, "store"])->name("souvenir.store");
        Route::get("/souvenir/{souvenir}/edit", [SouvenirController::class, "edit"])->name("souvenir.edit");
        Route::put("/souvenir/{souvenir}", [SouvenirController::class, "update"])->name("souvenir.update");
        Route::delete("/souvenir/{souvenir}", [SouvenirController::class, "destroy"])->name("souvenir.destroy");
        Route::get("/meja", [MejaController::class, "index"])->name("meja.index");
        Route::get("/meja/create", [MejaController::class, "create"])->name("meja.create");
        Route::post("/meja", [MejaController::class, "store"])->name("meja.store");
        Route::get("/meja/{meja}/edit", [MejaController::class, "edit"])->name("meja.edit");
        Route::put("/meja/{meja}", [MejaController::class, "update"])->name("meja.update");
        Route::delete("/meja/{meja}", [MejaController::class, "destroy"])->name("meja.destroy");
        Route::post("/meja/{meja}/assign", [MejaController::class, "assignTamu"])->name("meja.assignTamu");
        Route::delete("/meja-tamu/{mejaTamu}", [MejaController::class, "removeTamu"])->name("meja.removeTamu");
        Route::get("/grup", [GrupController::class, "index"])->name("grup.index");
        Route::get("/grup/create", [GrupController::class, "create"])->name("grup.create");
        Route::post("/grup", [GrupController::class, "store"])->name("grup.store");
        Route::get("/grup/{grup}/edit", [GrupController::class, "edit"])->name("grup.edit");
        Route::put("/grup/{grup}", [GrupController::class, "update"])->name("grup.update");
        Route::delete("/grup/{grup}", [GrupController::class, "destroy"])->name("grup.destroy");
        Route::get("/settings", [GuestSettingController::class, "edit"])->name("settings");
        Route::post("/settings", [GuestSettingController::class, "update"])->name("settings.update");
        Route::get("/pertanyaan", [PertanyaanController::class, "index"])->name("pertanyaan.index");
        Route::get("/pertanyaan/create", [PertanyaanController::class, "create"])->name("pertanyaan.create");
        Route::post("/pertanyaan", [PertanyaanController::class, "store"])->name("pertanyaan.store");
        Route::get("/pertanyaan/{pertanyaan}/edit", [PertanyaanController::class, "edit"])->name("pertanyaan.edit");
        Route::put("/pertanyaan/{pertanyaan}", [PertanyaanController::class, "update"])->name("pertanyaan.update");
        Route::delete("/pertanyaan/{pertanyaan}", [PertanyaanController::class, "destroy"])->name("pertanyaan.destroy");
        Route::get("/checkin", [CheckInController::class, "index"])->name("checkin");
        Route::post("/checkin/{tamu}", [CheckInController::class, "checkin"])->name("checkin.store");
    });
require __DIR__ . "/auth.php";






