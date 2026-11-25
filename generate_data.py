import csv
import json
import re

raw_data = """
,Kode,Nama Proyek 
,1,Proyek PIR SUS SEI BUATAN (PTP II)
,2,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan
,3,Peta Dasar Teknik Lokasi Dayun
,4,Kapling Daerah Transmigrasi PIR Trans Buatan
,5,Proyek PIR NES ADB PTP II Sei Buatan
,6,Gambar Ukur Desa Suak Lanjut
,7,Proyek PIR SUS PTP II LUBUK DALAM
,8,Kapling Daerah Transmigrasi Trans HTI Perawang
,9,Peta Bidang Tanah 
,10,Peta Gambar Situasi Khusus PT Ivo Mas Tunggal
,11,Peta Gambar Situasi Khusus PT Surya Intisari Raya
,12,Proyek Perluasan Rehabilitasi dan Peremajaan Tanaman Export (PRPTE)
,13,Pengukuran dan Pemetaan Batas Bidang Tanah PT IKPP
,14,Peta Kapling Daerah Transmigrasi Kecamatan Sei Apit
,15,Peta Situasi Khusus NO 11/1995 PT Meridan Sejati Surya Plantation
,16,Peta Situasi Khusus NO 05/1994  PT Ikadaya Yakin Mandiri
,17,Proyek Pengukuran Tanah Pemerintah Daerah
,18,Proyek Pengukuran Daerah Transmigrasi Tahun Anggaran 2005 Desa Tuah Indrapura
,19,Gambar Ukur Desa Maredan Kecamatan Tualang
,20,Pemetaan Keliling Batas Areal PT. Surya Intisari Raya
,21,Gambar Situasi PT Perawang Lumber Industri
,,,,,,,
No ,Kode,Judul/ Nama Peta ,Petunjuk Lembar,Lokasi,,TTD,
,,,,Desa,Kecamatan,Ya,Tidak
1,1.01,Peta Kapling Pendaftaran Tanah,43,Pangkalan Pisang,Siak Sri Indrapura,,P
2,1.02,Peta Kapling Pendaftaran Tanah,23,Pangkalan Pisang,Siak Sri Indrapura,P,  
3,1.03,Peta Kapling Pendaftaran Tanah,18,Pangkalan Pisang,Siak Sri Indrapura,P,
4,1.04,Peta Kapling Pendaftaran Tanah,36,Pangkalan Pisang,Siak Sri Indrapura,,P
5,1.05,Peta Kapling Pendaftaran Tanah,29,Pangkalan Pisang,Siak Sri Indrapura,,P
6,1.06,Peta Kapling Pendaftaran Tanah,42,Pangkalan Pisang,Siak Sri Indrapura,,P
7,1.07,Peta Kapling Pendaftaran Tanah,11,Pangkalan Pisang,Siak Sri Indrapura,P,
8,1.08,Peta Dasar Teknik Pendaftaran Tanah (Proyek PIR ADB SEI BUATAN),1,Dayun,Siak Sri Indrapura,P,
9,1.09,Peta Dasar Teknik Pendaftaran Tanah (Proyek PIR ADB SEI BUATAN),2,Dayun,Siak Sri Indrapura,P,
10,1.1,Peta Situasi Khusus Lokasi Kebun Inti PTP II Sei Buatan 913 Ha dan 810 Ha ,,Sei Buatan,Siak Sri Indrapura,P,
11,1.11,Peta Kapling Pendaftaran Tanah,1,Sikemang,Siak Sri Indrapura,P,
12,1.12,Peta Kapling Pendaftaran Tanah Proyek perkebunan PIR ADB PTP II Sei Buatan,7,Sikemang,Siak Sri Indrapura,P,
13,1.13,Peta Situasi Khusus Lokasi Kebun Inti PTP II Sei Buatan 40 Ha  ,,Sei Buatan,Siak Sri Indrapura,P,
14,1.14,Peta Kapling Pendaftaran Tanah Proyek perkebunan PIR ADB PTP II Sei Buatan,1,"Afdeling VII, Sikemang",Siak Sri Indrapura,P,
15,1.15,Peta Kapling Pendaftaran Tanah Proyek PIR ADB Sei Buatan (PTP II),1,Dayun,Siak Sri Indrapura,P,
16,1.16,Peta Kapling Pendaftaran Tanah Proyek PIR ADB Sei Buatan (PTP II),4,Dayun,Siak Sri Indrapura,P,
17,1.17,Peta Kapling Pendaftaran Tanah Proyek PIR ADB Sei Buatan (PTP II),2,"L . Pekarangan dan L.Pangan  AFD X Paket C, Dayun",Siak Sri Indrapura,P,
18,1.18,Peta Kapling Pendaftaran Tanah Proyek PIR ADB Sei Buatan (PTP II),4,"Perumahan Paket A. AFD X, Dayun",Siak Sri Indrapura,P,
19,1.19,Peta Kapling Proyek PIR ADB PT Perkebunan II Sei Buatan ,4,"Kebun dan Pekarangan Lahan Pangan AFD IX , Dayun",Siak Sri Indrapura,P,
20,1.2,Peta Kapling Proyek PIR ADB PT Perkebunan II Sei Buatan ,3,"Kebun AFD IX , Dayun",Siak Sri Indrapura,P,
21,1.21,Peta Kapling Pendaftaran Tanah Proyek Perkebunan PIR-ADB PTP II Sei Buatan,2,"Afdeling VII, Sikemang",Siak Sri Indrapura,P,
22,1.22,Peta Kapling Pendaftaran Tanah Proyek Perkebunan PIR-ADB PTP II Sei Buatan,5,"Afdeling VIII, Sikemang",Siak Sri Indrapura,P,
23,1.23,Peta Kapling Proyek PIR ADB PT Perkebunan II Sei Buatan ,11,"Kebun dan Pekarangan AFD IX , Dayun",Siak Sri Indrapura,P,
24,1.24,Peta Kapling Proyek PIR ADB PT Perkebunan II Sei Buatan ,2,"Kebun AFD IX, Dayun",Siak Sri Indrapura,P,
25,1.25,Peta Kapling Proyek PIR ADB PT Perkebunan II Sei Buatan ,1,"Kebun AFD IX, Dayun",Siak Sri Indrapura,P,
26,1.26,Peta Kapling Proyek PIR ADB PT Perkebunan II Sei Buatan ,12,"AFD IX, Dayun",Siak Sri Indrapura,P,
27,1.27,Peta Kapling Proyek PIR ADB PT Perkebunan II Sei Buatan ,10,"Kebun dan pekarangan AFD IX , Dayun",Siak Sri Indrapura,P,
28,1.28,Peta Kapling Proyek PIR ADB PT Perkebunan II Sei Buatan ,9,Dayun,Siak Sri Indrapura,P,
29,1.29,Peta Kapling Proyek PIR ADB PT Perkebunan II Sei Buatan ,8,"Kebun Perkarangan L.Pangan AFD IX , Dayun",Siak Sri Indrapura,P,
30,1.3,Peta Kapling Proyek PIR ADB PT Perkebunan II Sei Buatan ,2,"Kebun AFD IX, Dayun",Siak Sri Indrapura,P,
31,1.31,Peta Kapling Proyek PIR ADB PT Perkebunan II Sei Buatan ,6,Dayun,Siak Sri Indrapura,P,
32,1.32,Peta Kapling Proyek PIR ADB PT Perkebunan II Sei Buatan ,7,Dayun,Siak Sri Indrapura,P,
33,1.33,Peta Kapling Proyek PIR ADB PT Perkebunan II Sei Buatan ,5,"Lahan Pangan AFD IX, Dayun",Siak Sri Indrapura,P,
34,1.34,Peta Kapling Pendaftaran Tanah Proyek PIR ADB Sei Buatan (PTP II),2,Kebun Sawit AFD X,Siak Sri Indrapura,P,
35,1.35,Peta Kapling Pendaftaran Tanah Proyek PIR ADB Sei Buatan (PTP II),1,Lahan Pekarangan dan Lahan Pangan Paket 3 AFD X,Siak Sri Indrapura,P,
36,1.36,Peta Dasar Teknis Proyek PIR ADB PT Perkebunan II Sei Buatan,1,"Afdeling IX, Dayun",Siak Sri Indrapura,P,
37,1.37,Peta Kapling Pendaftaran Tanah Proyek PIR ADB Sei Buatan (PTP II),1,"Kebun Sawit AFD X, Dayun",Siak Sri Indrapura,P,
38,1.38,Peta Kapling Pendaftaran Tanah Proyek Perkebunan PIR-ADB PTP II Sei Buatan ,4,"Afdeling VIII, Sekemang",Siak Sri Indrapura,P,
,1,2.01,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan,18,Sikijang,Langgam,P,
,2,2.02,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan,8,Delik,Langgam,P,
,3,2.03,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan,1,Pangkalan Kerinci ,Langgam,P,
,4,2.04,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan,7,Delik,Langgam,P,
,5,2.05,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan,13,Sikijang,Langgam,P,
,6,2.06,Peta Dasar Teknik PT Inti Indosawit Subur ,,Dayun,Siak Sri Indrapura,P,
,7,2.07,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan,3,Delik,Langgam,P,
,8,2.08,Peta Kerja PIRTRANS PT Inti Indosawit Subur ,1,Dayun,Siak Sri Indrapura,P,
,9,2.09,Peta Kapling PIR-TRANS PT Inti Indosawit Subur ,3,Dayun,Siak Sri Indrapura,P,
,10,2.1,Peta Kapling PIR-TRANS PT Inti Indosawit Subur ,4,Dayun,Siak Sri Indrapura,P,
,11,2.11,Peta Kapling PIR-TRANS PT Inti Indosawit Subur ,2,Dayun,Siak Sri Indrapura,P,
,12,2.12,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan,4, Kerinci Kanan,Siak Sri Indrapura,P,
,13,2.13,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan,3, Kerinci Kanan,Siak Sri Indrapura,P,
,14,2.14,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan,2, Kerinci Kanan,Siak Sri Indrapura,P,
,15,2.15,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan,1,"PIR TRANS PT Inti Indosawit Buatan, Delik",Langgam,P,
,16,2.16,Peta Dasar Teknis PIR TRANS PT Inti Indosawit Subur Buatan,,"PIR TRANS PT Inti Indosawit Buatan, Delik",Langgam,P,
,17,2.17,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan,4,Delik,Langgam,P,
,18,2.18,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan,4,"Plasma SP01, Kerinci Kanan",Siak Sri Indrapura,P,
,19,2.19,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan,2,"PIR TRANS PT Inti Indosawit Buatan, Delik",Langgam,P,
,20,2.2,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan,5,"Plasma SP01, Kerinci Kanan",Siak Sri Indrapura,P,
,21,2.21,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan,6,"Plasma SP01, Kerinci Kanan",Siak Sri Indrapura,P,
,22,2.22,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan,2,"Kebun Buatan, Kerinci Kanan",Siak Sri Indrapura,P,
,23,2.23,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan,1,"Kebun Buatan, Kerinci Kanan",Siak Sri Indrapura,P,
,24,2.24,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan,4,"Kebun Buatan, Kerinci Kanan",Siak Sri Indrapura,P,
,25,2.25,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan,3,"PT Inti Indosawit Subur, Kerinci Kanan",Siak Sri Indrapura,P,
,26,2.26,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan,,"PIR TRANS PT Inti Indosawit , Delik",Siak Sri Indrapura,P,
,27,2.27,Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan,3,"Plasma SP01, Kerinci Kanan",Siak Sri Indrapura,P,
,1,3.01,Peta Dasar Teknik,,Dayun,Siak Sri Indrapura,P,
,1,4.01,Peta Kapling Daerah Transmigrasi,3,Sikijangmati,Siak Sri Indrapura,P,
,2,4.02,Peta Kapling Daerah Transmigrasi,1,Sikijangmati,Siak Sri Indrapura,P,
,3,4.03,Peta Kerja Daerah Transmigrasi,,Simpang Perak Jaya,Siak Sri Indrapura,,
,4,4.04,Peta Kapling Daerah Transmigrasi,1,Simpang Perak Jaya,Siak Sri Indrapura,P,
,5,4.05,Peta Kapling Daerah Transmigrasi,2,Simpang Perak Jaya,Siak Sri Indrapura,P,
,6,4.06,Peta Dasar Teknis Daerah Transmigrasi,,SP8,-,P,
,1,5.01,Peta Kapling Proyek PIR NES ADB PTP II Sei Buatan,2,Dayun,Siak Sri Indrapura,P,
,2,5.02,Peta Kapling Proyek PIR NES ADB PTP II Sei Buatan,4,Dayun,Siak Sri Indrapura,P,
,1,6.01,Gambar Ukur,,Suak Lanjut,Siak,,P
,1,7.01,Peta kapling pendaftaran tanah ,18,Rawang Kawo,Siak Sri Indrapura,P,
,2,7.02,Peta kapling pendaftaran tanah ,8,Rawang Kawo,Siak Sri Indrapura,P,
,3,7.03,Peta kapling pendaftaran tanah ,42,Rawang Kawo,Siak Sri Indrapura,P,
,4,7.04,Peta kapling pendaftaran tanah ,11,Rawang Kawo,Siak Sri Indrapura,P,
,5,7.05,Peta kapling pendaftaran tanah ,19,Rawang Kawo,Siak Sri Indrapura,P,
,1,8.01,Peta Dasar Teknik Daerah Transmigrasi,,Mandi Angin,Minas,P,
,2,8.02,Peta Kapling Daerah Transmigrasi,3,Mandi Angin,Minas,P,
,3,8.03,Peta Kapling Daerah Transmigrasi,2,Mandi Angin,Minas,P,
,1,9.01,Peta Bidang Tanah,42;222,Kandis,Minas,,P
,2,9.02,Peta Bidang Tanah,40;221,Sam sam,Kandis,P,
,1,10.01,Peta Gambar Situasi Khusus,,Kandis,Mandau,,P
,2,10.02,Peta Gambar Situasi Khusus,,Sam Sam,Mandau,P,
,1,11.01,Peta Gambar Situasi Khusus,,"Tualang, Maredan dan Tebing Tinggi",Siak Sri Indrapura dan Bukit Raya,P,
,1,12.01,Peta Situasi Pendaftaran Tanah (a),1,"Kampung Dalam, Perincit",Sei Apit,P,
,2,12.02,Peta Situasi Pendaftaran Tanah (b),1,"Kampung Dalam, Perincit",Sei Apit,P,
,3,12.03,Peta Situasi Pendaftaran Tanah ,1,"Sukajadi, Perincit",Sei Apit,P,
,4,12.04,Peta Situasi Pendaftaran Tanah,1,Teluk Lanus,Sei Apit,,
,1,13.01,Peta Bidang Tanah ,47.2-49.216-07/08,Pinang Sebatang,Tualang,P,
,2,13.02,Peta Bidang Tanah ,47.2-49.216-12/16,Pinang Sebatang Timur,Tualang,P,
,3,13.03,Peta Bidang Tanah ,47.2-50.216.09/10,Pinang Sebatang Timur,Tualang,P,
,4,13.04,Peta Gambar Situasi Khusus No 04/1994,21XVII,Pinang Sebatang,Siak,P,
,5,13.05,Peta Gambar Situasi Khusus No 01/1994,21XVII,Tualang perawang dan Pinang Sebatang,Siak,P,
,1,14.01,Peta Kapling Daerah Transmigrasi ,1,Princet,Sei Apit,P,
,1,15.01,Peta Gambar Situasi Khusus,21-XVII,"Kerinci Kiri, Maredan",Siak Sri Indrapura,P,
,1,16.01,Peta Gambar Situasi Khusus,21XVII,Kampung dalam dan Kampung Rempak,Siak Sri Indrapura,P,
,1,18.01,Peta Dasar Pendaftaran,48.1-01.222.14,Tuah Indrapura,Bunga Raya,P,
,2,18.02,Peta Dasar Pendaftaran,48.1-01.222.13,Tuah Indrapura,Bunga Raya,P,
,3,18.03,Peta Dasar Pendaftaran,48.1-01.222.15,Tuah Indrapura,Bunga Raya,P,
,4,18.04,Peta Dasar Pendaftaran,48.1-01.222 .01,Tuah Indrapura,Bunga Raya,P,
,5,18.05,Peta Dasar Pendaftaran,48.1-01.222.03,Tuah Indrapura,Bunga Raya,P,
,6,18.06,Peta Dasar Pendaftaran,48.1-01.222.10,Tuah Indrapura,Bunga Raya,P,
,7,18.07,Peta Dasar Pendaftaran,48.1-01.222.02,Tuah Indrapura,Bunga Raya,P,
,8,18.08,Peta Dasar Pendaftaran,48.1-01.221.16,Tuah Indrapura,Bunga Raya,P,
,9,18.09,Peta Dasar Pendaftaran,48.1-01.221.09,Tuah Indrapura,Bunga Raya,P,
,1,19.01,Gambar Ukur a,47.2-49.215,Maredan,Tualang,,P
,2,19.02,Gambar Ukur b,47.2-49.215,Maredan,Tualang,,P
,3,19.03,Gambar Ukur c,47.2-49.215,Maredan,Tualang,,P
,4,19.04,Gambar Ukur d,47.2-49.215,Maredan,Tualang,,P
,5,19.05,Gambar Ukur e,47.2-49.215,Maredan,Tualang,,P
,6,19.06,Gambar Ukur f,47.2-49.215,Maredan,Tualang,,P
,1,20.01,Peta Bidang Tanah,47.2-51.219,Muara Kelantan dan Lubuk Jering,Sei Mandau,P,
,1,21.01,Gambar Situasi,,Pinang Sebatang,Siak Sri Indrapura,P,
"""

projects = [
    {"id": 1, "namaProyek": "Proyek PIR SUS SEI BUATAN (PTP II)"},
    {"id": 2, "namaProyek": "Peta Kapling PIR-TRANS PT Inti Indosawit Subur Buatan"},
    {"id": 3, "namaProyek": "Peta Dasar Teknik Lokasi Dayun"},
    {"id": 4, "namaProyek": "Kapling Daerah Transmigrasi PIR Trans Buatan"},
    {"id": 5, "namaProyek": "Proyek PIR NES ADB PTP II Sei Buatan"},
    {"id": 6, "namaProyek": "Gambar Ukur Desa Suak Lanjut"},
    {"id": 7, "namaProyek": "Proyek PIR SUS PTP II LUBUK DALAM"},
    {"id": 8, "namaProyek": "Kapling Daerah Transmigrasi Trans HTI Perawang"},
    {"id": 9, "namaProyek": "Peta Bidang Tanah"},
    {"id": 10, "namaProyek": "Peta Gambar Situasi Khusus PT Ivo Mas Tunggal"},
    {"id": 11, "namaProyek": "Peta Gambar Situasi Khusus PT Surya Intisari Raya"},
    {"id": 12, "namaProyek": "Proyek Perluasan Rehabilitasi dan Peremajaan Tanaman Export (PRPTE)"},
    {"id": 13, "namaProyek": "Pengukuran dan Pemetaan Batas Bidang Tanah PT IKPP"},
    {"id": 14, "namaProyek": "Peta Kapling Daerah Transmigrasi Kecamatan Sei Apit"},
    {"id": 15, "namaProyek": "Peta Situasi Khusus NO 11/1995 PT Meridan Sejati Surya Plantation"},
    {"id": 16, "namaProyek": "Peta Situasi Khusus NO 05/1994 PT Ikadaya Yakin Mandiri"},
    {"id": 17, "namaProyek": "Proyek Pengukuran Tanah Pemerintah Daerah"},
    {"id": 18, "namaProyek": "Proyek Pengukuran Daerah Transmigrasi Tahun Anggaran 2005 Desa Tuah Indrapura"},
    {"id": 19, "namaProyek": "Gambar Ukur Desa Maredan Kecamatan Tualang"},
    {"id": 20, "namaProyek": "Pemetaan Keliling Batas Areal PT. Surya Intisari Raya"},
    {"id": 21, "namaProyek": "Gambar Situasi PT Perawang Lumber Industri"},
]

proj_dict = {p["id"]: p["namaProyek"] for p in projects}

records = []
lines = raw_data.strip().splitlines()

import io
reader = csv.reader(io.StringIO(raw_data))

for row in reader:
    if not row:
        continue
    # Clean row
    cleaned = [col.strip() for col in row]
    # Filter empty rows
    if not any(cleaned):
        continue
    
    # Check if row contains a kode like 1.01, 2.15, etc.
    kode = ""
    for idx, cell in enumerate(cleaned):
        if re.match(r"^\d+\.\d+$", cell):
            kode = cell
            kode_idx = idx
            break
            
    if kode:
        # Determine project ID from kode prefix (e.g. "1" from "1.01")
        prefix = int(kode.split('.')[0])
        proyek_nama = proj_dict.get(prefix, f"Proyek {prefix}")
        
        # After kode: Judul, Petunjuk Lembar, Desa, Kecamatan, Ya, Tidak
        # Look around kode_idx
        judul = cleaned[kode_idx + 1] if len(cleaned) > kode_idx + 1 else "Peta Pendaftaran Tanah"
        petunjuk_lembar = cleaned[kode_idx + 2] if len(cleaned) > kode_idx + 2 else "-"
        desa = cleaned[kode_idx + 3] if len(cleaned) > kode_idx + 3 else "-"
        kecamatan = cleaned[kode_idx + 4] if len(cleaned) > kode_idx + 4 else "-"
        
        ya_col = cleaned[kode_idx + 5] if len(cleaned) > kode_idx + 5 else ""
        tidak_col = cleaned[kode_idx + 6] if len(cleaned) > kode_idx + 6 else ""
        
        ttd = True
        if "p" in tidak_col.lower():
            ttd = False
        elif "p" in ya_col.lower():
            ttd = True
        else:
            ttd = bool(ya_col)
            
        record = {
            "id": f"map-{kode.replace('.', '-')}",
            "kode": kode,
            "proyekId": prefix,
            "proyekNama": proyek_nama,
            "judul": judul,
            "petunjukLembar": petunjuk_lembar if petunjuk_lembar else "-",
            "desa": desa if desa else "-",
            "kecamatan": kecamatan if kecamatan else "-",
            "ttd": ttd,
            "skala": "1:1000" if "kapling" in judul.lower() else "1:2500",
            "tahunArsip": "1994" if prefix in [10, 13, 16] else ("1995" if prefix == 15 else ("2005" if prefix == 18 else "1992")),
            "sketsaUrl": f"/sketches/{kode.replace('.', '_')}.svg",
            "keterangan": f"Arsip Fisik Lembar #{petunjuk_lembar or 'Utama'} di Ruang Warkah BPN Siak"
        }
        records.append(record)

print(f"Parsed {len(records)} map records across {len(projects)} projects.")

ts_content = f"""// src/data/initialData.ts
// Data Awal Sistem Informasi Arsip Peta BPN Kabupaten Siak

export interface MapProject {{
  id: number;
  namaProyek: string;
}}

export interface MapRecord {{
  id: string;
  kode: string;
  proyekId: number;
  proyekNama: string;
  judul: string;
  petunjukLembar: string;
  desa: string;
  kecamatan: string;
  ttd: boolean;
  skala: string;
  tahunArsip: string;
  sketsaUrl?: string;
  keterangan?: string;
}}

export interface AppComplaint {{
  id: string;
  nama: string;
  kontak: string;
  keluhan: string;
  tanggal: string;
  status: 'Menunggu' | 'Ditindaklanjuti' | 'Selesai';
}}

export interface SystemConfig {{
  googleDriveLink: string;
  informasiArsip: string;
  instansiNama: string;
  alamatKantor: string;
  kontakAdmin: string;
}}

export const INITIAL_PROJECTS: MapProject[] = {json.dumps(projects, indent=2)};

export const INITIAL_MAPS: MapRecord[] = {json.dumps(records, indent=2)};

export const INITIAL_CONFIG: SystemConfig = {{
  googleDriveLink: "https://drive.google.com/drive/folders/1BPN-Siak-Arsip-Peta-Lama-Drive",
  informasiArsip: "Pelayanan digitalisasi arsip peta lama Kantor Pertanahan Kabupaten Siak. Peta warkah fisik tersimpan di Ruang Arsip Seksi Pengukuran dan Pemetaan Kadastral. Untuk permohonan salinan resmi silakan sertakan nomor kode dan lembar peta.",
  instansiNama: "Kantor Pertanahan Kabupaten Siak - Kementerian ATR/BPN",
  alamatKantor: "Komplek Perkantoran Tanjung Agung, Kabupaten Siak, Riau",
  kontakAdmin: "admin.pemetaan@bpn-siak.go.id"
}};

export const INITIAL_COMPLAINTS: AppComplaint[] = [
  {{
    id: "comp-1",
    nama: "Budi Santoso",
    kontak: "0812-7654-3210",
    keluhan: "Mohon bantuan pengecekan lembar 43 Proyek PIR ADB Dayun yang tulisan batasnya agak pudar di arsip fisik.",
    tanggal: "2026-11-20 09:30",
    status: "Ditindaklanjuti"
  }},
  {{
    id: "comp-2",
    nama: "Ahmad Dahlan",
    kontak: "ahmad.d@gmail.com",
    keluhan: "Apakah peta kapling desa Sikemang tahun 1992 sudah ada versi dwg atau shp hasil digitasi terbarunya?",
    tanggal: "2026-11-22 14:15",
    status: "Menunggu"
  }}
];
"""

with open(r"C:\Users\asus\Videos\bpn\src\data\initialData.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print("Saved successfully to C:\\Users\\asus\\Videos\\bpn\\src\\data\\initialData.ts")
