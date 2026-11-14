-- Jalankan SELURUH isi file ini sekaligus di Supabase > SQL Editor > New query > RUN

create table if not exists regions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  province text not null,
  characteristic text not null,
  description text not null
);

create table if not exists motifs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,        -- Keraton / Pesisir / Pedalaman
  occasion text not null,        -- Upacara Adat / Pernikahan / Acara Resmi / Busana Harian
  philosophy text not null,
  description text not null,
  region_id uuid references regions(id) on delete set null
);

-- Bersihkan data lama jika menjalankan ulang agar tidak dobel
truncate table motifs, regions restart identity cascade;

-- Data Daerah Asal Batik
insert into regions (name, province, characteristic, description) values
('Yogyakarta', 'DI Yogyakarta', 'Warna sogan cokelat tua, hitam, dan putih bersih dengan pola simetris keraton', 'Pusat batik klasik keraton yang sarat aturan adat, makna spiritual, dan keselarasan hidup.'),
('Surakarta (Solo)', 'Jawa Tengah', 'Warna sogan keemasan yang hangat dengan garis halus dan detail rumit', 'Batik Solo dikenal lembut dan anggun, berkembang kuat di lingkungan Keraton Kasunanan dan Mangkunegaran.'),
('Pekalongan', 'Jawa Tengah', 'Warna cerah (merah, biru, hijau, oranye) dengan pengaruh budaya Tionghoa, Arab, dan Eropa', 'Dijuluki Kota Batik karena kekayaan motif pesisir yang dinamis, floral, dan mudah dipadukan untuk busana modern.'),
('Cirebon', 'Jawa Barat', 'Motif awan berarak, warna biru, merah marun, dan aksen keemasan', 'Batik pesisir dengan pengaruh kuat sejarah maritim dan Keraton Kasepuhan serta Kanoman.'),
('Lasem', 'Jawa Tengah', 'Warna merah darah ayam khas (abang getih pithik) berpadu motif naga dan bunga', 'Salah satu sentra batik tertua di pesisir utara Jawa yang memadukan budaya Jawa dan peranakan Tionghoa.'),
('Madura', 'Jawa Timur', 'Warna berani (merah terang, kuning, hijau) dengan goresan tegas dan ekspresif', 'Batik Madura dibuat dengan pewarnaan alami yang kuat sehingga tampil mencolok, berkarakter, dan penuh semangat.'),
('Garut', 'Jawa Barat', 'Warna lembut krem gading, biru nila, dan sogan dengan motif flora-fauna Sunda', 'Dikenal dengan nama Batik Garutan yang memiliki pola geometris diagonal dan motif alam yang tenang.');

-- Data Motif Batik Nusantara
insert into motifs (name, category, occasion, philosophy, description, region_id) values
(
  'Parang Rusak',
  'Keraton',
  'Upacara Adat',
  'Melambangkan pengendalian diri, keteguhan hati melawan hawa nafsu, serta kesinambungan perjuangan hidup seperti ombak laut yang tak pernah putus.',
  'Motif diagonal berbentuk huruf S yang saling bertaut membentuk garis miring tegas. Dahulu termasuk motif larangan yang hanya dikenakan keluarga keraton.',
  (select id from regions where name = 'Yogyakarta' limit 1)
),
(
  'Kawung',
  'Keraton',
  'Acara Resmi',
  'Menggambarkan kesucian hati, keadilan, dan pengendalian diri manusia agar selalu berguna bagi sesama, terinspirasi dari buah aren (kolang-kaling) yang tersusun rapi.',
  'Pola empat bulatan lonjong simetris yang menyerupai kelopak bunga teratai. Salah satu motif batik tertua di Jawa.',
  (select id from regions where name = 'Yogyakarta' limit 1)
),
(
  'Sidomukti',
  'Keraton',
  'Pernikahan',
  'Kata "Sido" berarti terlaksana dan "Mukti" berarti mulia atau sejahtera. Berisi doa agar pemakainya mencapai kemuliaan, kecukupan lahir batin, dan keharmonisan rumah tangga.',
  'Menampilkan ornamen kupu-kupu, singgasana, dan bangunan dengan warna sogan hangat yang sering dipakai pengantin Jawa.',
  (select id from regions where name = 'Surakarta (Solo)' limit 1)
),
(
  'Truntum',
  'Keraton',
  'Pernikahan',
  'Berasal dari kata "tumaruntum" yang artinya tumbuh kembali. Melambangkan kasih sayang tulus orang tua yang membimbing anak menuju kehidupan rumah tangga baru.',
  'Motif bertabur bintang-bintang kecil di atas latar gelap, biasa dikenakan oleh orang tua pengantin pada upacara pernikahan adat.',
  (select id from regions where name = 'Surakarta (Solo)' limit 1)
),
(
  'Sekar Jagad',
  'Keraton',
  'Acara Resmi',
  'Berarti "bunga dunia", melambangkan keindahan keberagaman yang menyatu harmonis dalam satu kesatuan.',
  'Tersusun dari potongan-potongan pulau atau petak bermotif berbeda yang dirangkai seperti peta dunia penuh warna.',
  (select id from regions where name = 'Surakarta (Solo)' limit 1)
),
(
  'Mega Mendung',
  'Pesisir',
  'Acara Resmi',
  'Awan pembawa hujan melambangkan kesabaran, keteduhan hati, dan kemampuan meredam amarah di tengah situasi panas.',
  'Motif ikonik berbentuk gumpalan awan bergradasi tujuh lapis warna biru atau merah yang sangat khas dari Cirebon.',
  (select id from regions where name = 'Cirebon' limit 1)
),
(
  'Tujuh Rupa',
  'Pesisir',
  'Busana Harian',
  'Melambangkan keterbukaan, keramahan, dan akulturasi harmonis masyarakat pesisir terhadap berbagai budaya pendatang.',
  'Dipenuhi ragam hias bunga, daun, dan kupu-kupu dengan warna-warni cerah yang sangat populer untuk kemeja dan kebaya modern.',
  (select id from regions where name = 'Pekalongan' limit 1)
),
(
  'Jlamprang',
  'Pesisir',
  'Acara Resmi',
  'Menggambarkan keseimbangan arah mata angin dan keteraturan alam semesta melalui pola titik dan garis geometris.',
  'Motif geometris berbentuk lingkaran dan bintang segi delapan yang terinspirasi dari kain patola India dan budaya Arab.',
  (select id from regions where name = 'Pekalongan' limit 1)
),
(
  'Latohan & Sekar',
  'Pesisir',
  'Busana Harian',
  'Melambangkan kesuburan laut, keberanian, dan semangat hidup masyarakat pesisir utara Jawa.',
  'Menggabungkan warna merah marun khas Lasem dengan gambar tumbuhan laut latoh dan bunga peoni.',
  (select id from regions where name = 'Lasem' limit 1)
),
(
  'Gentongan',
  'Pedalaman',
  'Upacara Adat',
  'Melambangkan kesabaran dan ketekunan tingkat tinggi karena proses pewarnaannya direndam di dalam gentong tanah liat selama berbulan-bulan.',
  'Batik tulis khas Tanjung Bumi Madura dengan warna pekat alami, motif burung, dan sulur tanaman yang tegas.',
  (select id from regions where name = 'Madura' limit 1)
),
(
  'Merak Ngibing',
  'Pedalaman',
  'Busana Harian',
  'Menggambarkan keanggunan, keceriaan, dan pesona alam Priangan yang sejuk dan damai.',
  'Menampilkan sepasang burung merak yang sedang menari di antara bunga dengan latar warna krem gading khas Garut.',
  (select id from regions where name = 'Garut' limit 1)
);
