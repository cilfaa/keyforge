-- Jalankan SELURUH isi file ini sekaligus di Supabase > SQL Editor > New query > RUN

create table switches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,            -- Linear / Tactile / Clicky
  actuation_force integer,       -- gram
  travel_mm numeric(3,1),        -- jarak tekan (mm)
  sound text,
  description text
);

create table keyboards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  layout text,                   -- 60% / 65% / 75% / TKL / Full
  price numeric(12,0) default 0, -- rupiah (perkiraan)
  switch_id uuid references switches(id) on delete set null,
  description text
);

-- Data contoh: switch
insert into switches (name, type, actuation_force, travel_mm, sound, description) values
('Gateron Red',   'Linear',  45, 4.0, 'Senyap',  'Mulus dan ringan, tanpa bump. Favorit untuk gaming.'),
('Gateron Brown', 'Tactile', 55, 4.0, 'Sedang',  'Ada bump halus saat ditekan. Enak untuk ngetik dan gaming.'),
('Gateron Blue',  'Clicky',  60, 4.0, 'Nyaring', 'Bunyi klik keras dan bump jelas. Cocok untuk pecinta suara ketikan.'),
('Cherry MX Red',   'Linear',  45, 4.0, 'Senyap', 'Switch linear klasik dari Cherry. Ringan dan mulus.'),
('Cherry MX Brown', 'Tactile', 55, 4.0, 'Sedang', 'Switch tactile klasik. Serba bisa untuk kerja dan game.'),
('Cherry MX Blue',  'Clicky',  60, 4.0, 'Nyaring','Klik tajam dan jelas, tapi berisik di ruang bersama.'),
('Kailh Box White', 'Clicky',  55, 3.6, 'Nyaring','Klik tajam dan renyah, tahan debu berkat desain box.'),
('Akko CS Jelly Pink', 'Linear', 37, 3.6, 'Senyap', 'Sangat ringan, pas untuk tangan yang cepat lelah.');

-- Data contoh: keyboard
insert into keyboards (name, brand, layout, price, switch_id, description) values
('Keychron K2', 'Keychron', '75%', 1300000, (select id from switches where name='Gateron Brown'), 'Keyboard wireless populer dengan layout 75% yang ringkas. Cocok untuk mahasiswa yang sering membawa laptop.'),
('Royal Kludge RK61', 'Royal Kludge', '60%', 650000, (select id from switches where name='Gateron Blue'), 'Keyboard 60% murah dengan Bluetooth. Pilihan awal paling pas untuk pemula.'),
('Akko 3068B', 'Akko', '65%', 1100000, (select id from switches where name='Akko CS Jelly Pink'), 'Layout 65% dengan keycap tebal dan suara ketikan yang enak.'),
('Logitech G Pro', 'Logitech', 'TKL', 1500000, (select id from switches where name='Gateron Red'), 'Keyboard TKL untuk gaming kompetitif dengan desain simpel dan kabel lepas.'),
('Ducky One 3', 'Ducky', 'Full', 2000000, (select id from switches where name='Cherry MX Brown'), 'Keyboard full-size berkualitas tinggi dengan build kokoh dan keycap PBT.'),
('Leobog Hi75', 'Leobog', '75%', 900000, (select id from switches where name='Gateron Red'), 'Keyboard 75% dengan hot-swap, bisa ganti switch tanpa solder.'),
('Fantech MK856', 'Fantech', 'TKL', 450000, (select id from switches where name='Kailh Box White'), 'Keyboard TKL ramah kantong dengan lampu RGB. Cocok untuk gamer pemula.'),
('Rexus Daxa M71', 'Rexus', '75%', 550000, (select id from switches where name='Cherry MX Red'), 'Keyboard mekanik lokal dengan layout 75% dan fitur hot-swap.');
