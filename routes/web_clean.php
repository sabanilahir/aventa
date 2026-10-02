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
Route::withoutMiddleware(
