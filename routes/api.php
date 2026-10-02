<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FaceVerificationController;
use App\Http\Controllers\GuestRegisterController;

Route::post("/face/register", [FaceVerificationController::class, "registerFace"]);
Route::get("/face/status", [FaceVerificationController::class, "checkFaceStatus"]);
Route::delete("/face/delete", [FaceVerificationController::class, "deleteFace"]);
Route::post("/face/verify", [FaceVerificationController::class, "verifyFace"]);

Route::post("/guest/register/simpan", [GuestRegisterController::class, "store"]);
