$jsContent = @"
  return (
    <AppLayout>
      <Head title=`"Pengaturan Trah`" />
      <div className=`"p-6 space-y-6`">
        <h1 className=`"text-2xl font-bold`">Pengaturan Direktori Trah</h1>
        <form onSubmit={handleSubmit} className=`"space-y-6`">
          <Card>
            <CardHeader><CardTitle className=`"flex items-center gap-2`"><ImageIcon className=`"w-5 h-5`" />Pengaturan Gambar</CardTitle></CardHeader>
            <CardContent className=`"space-y-6`">
              {imageFields.map((field) => (
                <div key={field.key} className=`"space-y-2`">
                  <Label>{field.label}</Label>
                  <div className=`"flex items-start gap-4`">
                    <div className=`"border rounded p-2 bg-muted/50`">
                      {preview[field.key as keyof typeof preview] ? (
                        <div className=`"relative`">
                          <img src={preview[field.key as keyof typeof preview] as string} alt={field.label} className=`"w-24 h-24 object-contain`" />
                          <button type=`"button`" onClick={() => handleDeleteImage(field.key)} disabled={deleting === field.key} className=`"absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:opacity-50`">
                            <Trash2 className=`"w-4 h-4`" />
                          </button>
                        </div>
                      ) : (
                        <div className=`"w-24 h-24 flex items-center justify-center text-muted-foreground`"><ImageIcon className=`"w-8 h-8`" /></div>
                      )}
                    </div>
                    <div className=`"flex-1`">
                      <Input type=`"file`" onChange={(e) => handleFileChange(field.key, e.target.files?.[0] || null)} />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className=`"flex items-center gap-2`"><Save className=`"w-5 h-5`" />Informasi Organisasi</CardTitle></CardHeader>
            <CardContent className=`"space-y-4`">
              <div className=`"grid grid-cols-1 md:grid-cols-2 gap-4`">
                <div className=`"space-y-2`">
                  <Label>Nama Tanda Tangan</Label>
                  <Input value={formData.nama_tanda_tangan} onChange={(e) => setFormData((prev) => ({ ...prev, nama_tanda_tangan: e.target.value }))} />
                </div>
                <div className=`"space-y-2`">
                  <Label>Moto Organisasi</Label>
                  <Input value={formData.moto_organisasi} onChange={(e) => setFormData((prev) => ({ ...prev, moto_organisasi: e.target.value }))} />
                </div>
              </div>
              <div className=`"space-y-2`">
                <Label>Alamat Kantor</Label>
                <Input value={formData.alamat_kantor} onChange={(e) => setFormData((prev) => ({ ...prev, alamat_kantor: e.target.value }))} />
              </div>
              <div className=`"grid grid-cols-1 md:grid-cols-2 gap-4`">
                <div className=`"space-y-2`">
                  <Label>Telepon</Label>
                  <Input type=`"tel`" value={formData.telepon_kontak} onChange={(e) => setFormData((prev) => ({ ...prev, telepon_kontak: e.target.value }))} />
                </div>
                <div className=`"space-y-2`">
                  <Label>Email</Label>
                  <Input type=`"email`" value={formData.email_kontak} onChange={(e) => setFormData((prev) => ({ ...prev, email_kontak: e.target.value }))} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className=`"flex justify-end`">
            <Button type=`"submit`" size=`"lg`"><Save className=`"w-4 h-4 mr-2`" />Simpan</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
"@
Write-Host "Part 2 created"