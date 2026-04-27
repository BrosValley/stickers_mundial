DO $$
DECLARE
  col_id UUID;
  sec_fwc_id UUID;
  grp_a UUID; grp_b UUID; grp_c UUID; grp_d UUID;
  grp_e UUID; grp_f UUID; grp_g UUID; grp_h UUID;
  grp_i UUID; grp_j UUID; grp_k UUID; grp_l UUID;
  c_id UUID;
  country_rec RECORD;
  sticker_num INTEGER;
BEGIN
  -- Collection
  INSERT INTO public.collections (name, slug, description, is_active)
  VALUES ('Mundial 2026', 'mundial-2026', 'Álbum oficial del Mundial de Fútbol 2026', true)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO col_id;

  -- FWC section
  INSERT INTO public.sections (collection_id, name, slug, type, sort_order)
  VALUES (col_id, 'FWC Especiales', 'fwc', 'special', 0)
  ON CONFLICT (collection_id, slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO sec_fwc_id;

  -- Groups
  INSERT INTO public.groups (collection_id, name, slug, sort_order) VALUES (col_id, 'Grupo A', 'grupo-a',  1) ON CONFLICT (collection_id, slug) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO grp_a;
  INSERT INTO public.groups (collection_id, name, slug, sort_order) VALUES (col_id, 'Grupo B', 'grupo-b',  2) ON CONFLICT (collection_id, slug) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO grp_b;
  INSERT INTO public.groups (collection_id, name, slug, sort_order) VALUES (col_id, 'Grupo C', 'grupo-c',  3) ON CONFLICT (collection_id, slug) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO grp_c;
  INSERT INTO public.groups (collection_id, name, slug, sort_order) VALUES (col_id, 'Grupo D', 'grupo-d',  4) ON CONFLICT (collection_id, slug) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO grp_d;
  INSERT INTO public.groups (collection_id, name, slug, sort_order) VALUES (col_id, 'Grupo E', 'grupo-e',  5) ON CONFLICT (collection_id, slug) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO grp_e;
  INSERT INTO public.groups (collection_id, name, slug, sort_order) VALUES (col_id, 'Grupo F', 'grupo-f',  6) ON CONFLICT (collection_id, slug) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO grp_f;
  INSERT INTO public.groups (collection_id, name, slug, sort_order) VALUES (col_id, 'Grupo G', 'grupo-g',  7) ON CONFLICT (collection_id, slug) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO grp_g;
  INSERT INTO public.groups (collection_id, name, slug, sort_order) VALUES (col_id, 'Grupo H', 'grupo-h',  8) ON CONFLICT (collection_id, slug) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO grp_h;
  INSERT INTO public.groups (collection_id, name, slug, sort_order) VALUES (col_id, 'Grupo I', 'grupo-i',  9) ON CONFLICT (collection_id, slug) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO grp_i;
  INSERT INTO public.groups (collection_id, name, slug, sort_order) VALUES (col_id, 'Grupo J', 'grupo-j', 10) ON CONFLICT (collection_id, slug) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO grp_j;
  INSERT INTO public.groups (collection_id, name, slug, sort_order) VALUES (col_id, 'Grupo K', 'grupo-k', 11) ON CONFLICT (collection_id, slug) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO grp_k;
  INSERT INTO public.groups (collection_id, name, slug, sort_order) VALUES (col_id, 'Grupo L', 'grupo-l', 12) ON CONFLICT (collection_id, slug) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO grp_l;

  -- Temp table for countries
  CREATE TEMP TABLE _seed_countries (
    c_name TEXT, c_code TEXT, c_slug TEXT, c_group_id UUID, c_sort INTEGER
  ) ON COMMIT DROP;

  INSERT INTO _seed_countries VALUES
    ('México',         'MEX', 'mexico',        grp_a,  1),
    ('Estados Unidos', 'USA', 'estados-unidos', grp_a,  2),
    ('Canadá',         'CAN', 'canada',         grp_a,  3),
    ('Argentina',      'ARG', 'argentina',      grp_b,  4),
    ('Chile',          'CHI', 'chile',          grp_b,  5),
    ('Perú',           'PER', 'peru',           grp_b,  6),
    ('Brasil',         'BRA', 'brasil',         grp_c,  7),
    ('Colombia',       'COL', 'colombia',       grp_c,  8),
    ('Ecuador',        'ECU', 'ecuador',        grp_c,  9),
    ('España',         'ESP', 'espana',         grp_d, 10),
    ('Portugal',       'POR', 'portugal',       grp_d, 11),
    ('Marruecos',      'MAR', 'marruecos',      grp_d, 12),
    ('Francia',        'FRA', 'francia',        grp_e, 13),
    ('Bélgica',        'BEL', 'belgica',        grp_e, 14),
    ('Países Bajos',   'NED', 'paises-bajos',   grp_e, 15),
    ('Alemania',       'GER', 'alemania',       grp_f, 16),
    ('Austria',        'AUT', 'austria',        grp_f, 17),
    ('Suiza',          'SUI', 'suiza',          grp_f, 18),
    ('Inglaterra',     'ENG', 'inglaterra',     grp_g, 19),
    ('Escocia',        'SCO', 'escocia',        grp_g, 20),
    ('Gales',          'WAL', 'gales',          grp_g, 21),
    ('Italia',         'ITA', 'italia',         grp_h, 22),
    ('Croacia',        'CRO', 'croacia',        grp_h, 23),
    ('Eslovenia',      'SVN', 'eslovenia',      grp_h, 24),
    ('Uruguay',        'URU', 'uruguay',        grp_i, 25),
    ('Bolivia',        'BOL', 'bolivia',        grp_i, 26),
    ('Venezuela',      'VEN', 'venezuela',      grp_i, 27),
    ('Japón',          'JPN', 'japon',          grp_j, 28),
    ('Corea del Sur',  'KOR', 'corea-del-sur',  grp_j, 29),
    ('Australia',      'AUS', 'australia',      grp_j, 30),
    ('Arabia Saudita', 'KSA', 'arabia-saudita', grp_k, 31),
    ('Irán',           'IRN', 'iran',           grp_k, 32),
    ('Qatar',          'QAT', 'qatar',          grp_k, 33),
    ('Nigeria',        'NGA', 'nigeria',        grp_l, 34),
    ('Senegal',        'SEN', 'senegal',        grp_l, 35),
    ('Camerún',        'CMR', 'camerun',        grp_l, 36);

  -- Insert countries and their stickers
  FOR country_rec IN SELECT * FROM _seed_countries ORDER BY c_sort LOOP

    INSERT INTO public.countries (collection_id, group_id, name, code, slug, sort_order)
    VALUES (col_id, country_rec.c_group_id, country_rec.c_name, country_rec.c_code, country_rec.c_slug, country_rec.c_sort)
    ON CONFLICT (collection_id, code) DO UPDATE
      SET name = EXCLUDED.name, group_id = EXCLUDED.group_id
    RETURNING id INTO c_id;

    FOR sticker_num IN 1..20 LOOP
      INSERT INTO public.stickers (collection_id, country_id, code, number, sort_order)
      VALUES (
        col_id,
        c_id,
        country_rec.c_code || '-' || LPAD(sticker_num::TEXT, 2, '0'),
        sticker_num,
        (country_rec.c_sort - 1) * 20 + sticker_num
      )
      ON CONFLICT (collection_id, code) DO NOTHING;
    END LOOP;

  END LOOP;

  -- FWC special stickers
  FOR sticker_num IN 1..20 LOOP
    INSERT INTO public.stickers (collection_id, section_id, code, number, name, sort_order)
    VALUES (
      col_id,
      sec_fwc_id,
      'FWC-' || LPAD(sticker_num::TEXT, 2, '0'),
      sticker_num,
      'FWC Especial ' || sticker_num,
      720 + sticker_num
    )
    ON CONFLICT (collection_id, code) DO NOTHING;
  END LOOP;

END $$;
