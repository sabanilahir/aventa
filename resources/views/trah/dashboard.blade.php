<!DOCTYPE html>
<html>
<head>
    <title>Dashboard Trah</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: sans-serif; padding: 20px; }
        .card { border: 1px solid #ddd; padding: 20px; margin: 10px; border-radius: 8px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        .charts { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
        h1 { color: #333; }
    </style>
</head>
<body>
    <h1>📊 Dashboard Trah Patrap Senopati</h1>

    <div class="grid">
        <div class="card">
            <h3>Total Anggota</h3>
            <h2>{{ $totalMembers }}</h2>
        </div>
        <div class="card">
            <h3>Anggota Baru (Bulan Ini)</h3>
            <h2>{{ $membersThisMonth }}</h2>
        </div>
        <div class="card">
            <h3>Profesi Beragam</h3>
            <h2>{{ $professionStats->count() }}</h2>
        </div>
    </div>

    <div class="charts">
        <div class="card">
            <h3>Statistik Bulanan</h3>
            <canvas id="barChart"></canvas>
        </div>
        <div class="card">
            <h3>Distribusi Profesi</h3>
            <canvas id="pieChart"></canvas>
        </div>
    </div>

    <script>
        new Chart(document.getElementById('barChart'), {
            type: 'bar',
            data: {
                labels: {!! json_encode(array_values($monthNames)) !!},
                datasets: [{
                    label: 'Jumlah Anggota',
                    data: {!! json_encode(array_values($monthlyData)) !!},
                    backgroundColor: 'rgba(54, 162, 235, 0.5)'
                }]
            }
        });

        new Chart(document.getElementById('pieChart'), {
            type: 'doughnut',
            data: {
                labels: {!! json_encode($professionStats->pluck('profesi_pekerjaan')) !!},
                datasets: [{
                    data: {!! json_encode($professionStats->pluck('total')) !!},
                    backgroundColor: ['#ff6384','#36a2eb','#ffce56','#4bc0c0','#9966ff']
                }]
            }
        });
    </script>
</body>
</html>
