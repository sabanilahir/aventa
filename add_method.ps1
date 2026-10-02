    public function deleteImage(Request $request, $field)
    {
        $allowedFields = ['logo_organisasi', 'gambar_stempel', 'gambar_tanda_tangan', 'foto_panembahan', 'gambar_qr'];
        
        if (!in_array($field, $allowedFields)) {
            return response()->json(['success' => false, 'message' => 'Field tidak valid'], 400);
        }
        
        $value = TrahSetting::getValue($field);
        if ($value) {
            Storage::disk('public')->delete($value);
            TrahSetting::setValue($field, null, 'image');
        }
        
        return response()->json(['success' => true, 'message' => 'Gambar berhasil dihapus']);
    }
}