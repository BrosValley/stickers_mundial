DO $$
DECLARE
  col_id     UUID;
  sec_est_id UUID;
  sec_for_id UUID;
  sec_cdh_id UUID;
  sec_cdc_id UUID;
  grp_a UUID; grp_b UUID; grp_c UUID; grp_d UUID;
  grp_e UUID; grp_f UUID; grp_g UUID; grp_h UUID;
  grp_i UUID; grp_j UUID; grp_k UUID; grp_l UUID;
  c_id        UUID;
  country_rec RECORD;
  sticker_num INTEGER;
BEGIN

  -- ────────────────────────────────────────────────
  -- Colección
  -- ────────────────────────────────────────────────
  INSERT INTO public.collections (name, slug, description, is_active, emojis)
  VALUES ('FiguPlay 2026', 'figuplay-2026', 'Álbum FiguPlay del Mundial de Fútbol 2026', true, '⚽🃏')
  ON CONFLICT (slug) DO UPDATE SET
    name        = EXCLUDED.name,
    description = EXCLUDED.description,
    emojis      = EXCLUDED.emojis
  RETURNING id INTO col_id;

  -- ────────────────────────────────────────────────
  -- Secciones especiales
  --   sort_order 0-3 → aparecen antes/después de los países
  -- ────────────────────────────────────────────────
  INSERT INTO public.sections (collection_id, name, slug, type, sort_order)
  VALUES (col_id, 'Estadios', 'estadios', 'special', 0)
  ON CONFLICT (collection_id, slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order
  RETURNING id INTO sec_est_id;

  INSERT INTO public.sections (collection_id, name, slug, type, sort_order)
  VALUES (col_id, 'Formaciones', 'formaciones', 'special', 1)
  ON CONFLICT (collection_id, slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order
  RETURNING id INTO sec_for_id;

  INSERT INTO public.sections (collection_id, name, slug, type, sort_order)
  VALUES (col_id, 'Cuadro de Honor', 'cuadro-de-honor', 'special', 2)
  ON CONFLICT (collection_id, slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order
  RETURNING id INTO sec_cdh_id;

  INSERT INTO public.sections (collection_id, name, slug, type, sort_order)
  VALUES (col_id, 'Caras de la Copa', 'caras-de-la-copa', 'special', 3)
  ON CONFLICT (collection_id, slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order
  RETURNING id INTO sec_cdc_id;

  -- ────────────────────────────────────────────────
  -- Grupos A – L
  -- ────────────────────────────────────────────────
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

  -- ────────────────────────────────────────────────
  -- Tabla temporal: países
  --   c_sort  → orden global del país (1-48)
  --   c_count → número de estampas del país (9 o 18)
  --   c_start → número de estampa global donde inicia
  -- ────────────────────────────────────────────────
  CREATE TEMP TABLE _fp_countries (
    c_name     TEXT,
    c_code     TEXT,
    c_slug     TEXT,
    c_group_id UUID,
    c_sort     INTEGER,
    c_count    INTEGER,
    c_start    INTEGER
  ) ON COMMIT DROP;

  INSERT INTO _fp_countries VALUES
    -- Grupo A (estampas 41-112)
    ('México',              'MEX', 'mexico',              grp_a,  1, 18,  41),
    ('Sudáfrica',           'RSA', 'sudafrica',           grp_a,  2, 18,  59),
    ('Corea del Sur',       'KOR', 'corea-del-sur',       grp_a,  3, 18,  77),
    ('República Checa',     'CZE', 'republica-checa',     grp_a,  4,  9,  95),
    -- Grupo B (estampas 104-166)
    ('Bosnia-Herzegovina',  'BIH', 'bosnia-herzegovina',  grp_b,  5,  9, 104),
    ('Canadá',              'CAN', 'canada',              grp_b,  6, 18, 113),
    ('Catar',               'QAT', 'catar',               grp_b,  7, 18, 131),
    ('Suiza',               'SUI', 'suiza',               grp_b,  8, 18, 149),
    -- Grupo C (estampas 167-238)
    ('Brasil',              'BRA', 'brasil',              grp_c,  9, 18, 167),
    ('Marruecos',           'MAR', 'marruecos',           grp_c, 10, 18, 185),
    ('Escocia',             'SCO', 'escocia',             grp_c, 11, 18, 203),
    ('Haití',               'HAI', 'haiti',               grp_c, 12,  9, 221),
    -- Grupo D (estampas 230-292)
    ('Turquía',             'TUR', 'turquia',             grp_d, 13,  9, 230),
    ('Estados Unidos',      'USA', 'estados-unidos',      grp_d, 14, 18, 239),
    ('Paraguay',            'PAR', 'paraguay',            grp_d, 15, 18, 257),
    ('Australia',           'AUS', 'australia',           grp_d, 16, 18, 275),
    -- Grupo E (estampas 293-364)
    ('Alemania',            'GER', 'alemania',            grp_e, 17, 18, 293),
    ('Costa de Marfil',     'CIV', 'costa-de-marfil',    grp_e, 18, 18, 311),
    ('Ecuador',             'ECU', 'ecuador',             grp_e, 19, 18, 329),
    ('Curazao',             'CUW', 'curazao',             grp_e, 20,  9, 347),
    -- Grupo F (estampas 356-418)
    ('Suecia',              'SWE', 'suecia',              grp_f, 21,  9, 356),
    ('Países Bajos',        'NED', 'paises-bajos',        grp_f, 22, 18, 365),
    ('Japón',               'JPN', 'japon',               grp_f, 23, 18, 383),
    ('Túnez',               'TUN', 'tunez',               grp_f, 24, 18, 401),
    -- Grupo G (estampas 419-490)
    ('Bélgica',             'BEL', 'belgica',             grp_g, 25, 18, 419),
    ('Egipto',              'EGY', 'egipto',              grp_g, 26, 18, 437),
    ('Irán',                'IRN', 'iran',                grp_g, 27, 18, 455),
    ('Nueva Zelanda',       'NZL', 'nueva-zelanda',       grp_g, 28, 18, 473),
    -- Grupo H (estampas 491-562)
    ('España',              'ESP', 'espana',              grp_h, 29, 18, 491),
    ('Arabia Saudita',      'KSA', 'arabia-saudita',      grp_h, 30, 18, 509),
    ('Uruguay',             'URU', 'uruguay',             grp_h, 31, 18, 527),
    ('Cabo Verde',          'CPV', 'cabo-verde',          grp_h, 32,  9, 545),
    -- Grupo I (estampas 554-616)
    ('Irak',                'IRQ', 'irak',                grp_i, 33,  9, 554),
    ('Francia',             'FRA', 'francia',             grp_i, 34, 18, 563),
    ('Senegal',             'SEN', 'senegal',             grp_i, 35, 18, 581),
    ('Noruega',             'NOR', 'noruega',             grp_i, 36, 18, 599),
    -- Grupo J (estampas 617-688)
    ('Argentina',           'ARG', 'argentina',           grp_j, 37, 18, 617),
    ('Argelia',             'ALG', 'argelia',             grp_j, 38, 18, 635),
    ('Austria',             'AUT', 'austria',             grp_j, 39, 18, 653),
    ('Jordania',            'JOR', 'jordania',            grp_j, 40,  9, 671),
    -- Grupo K (estampas 680-742)
    ('República del Congo', 'COD', 'republica-del-congo', grp_k, 41,  9, 680),
    ('Portugal',            'POR', 'portugal',            grp_k, 42, 18, 689),
    ('Uzbekistán',          'UZB', 'uzbekistan',          grp_k, 43, 18, 707),
    ('Colombia',            'COL', 'colombia',            grp_k, 44, 18, 725),
    -- Grupo L (estampas 743-814)
    ('Inglaterra',          'ENG', 'inglaterra',          grp_l, 45, 18, 743),
    ('Croacia',             'CRO', 'croacia',             grp_l, 46, 18, 761),
    ('Ghana',               'GHA', 'ghana',               grp_l, 47, 18, 779),
    ('Panamá',              'PAN', 'panama',              grp_l, 48, 18, 797);

  -- ────────────────────────────────────────────────
  -- Insertar países y sus estampas
  -- ────────────────────────────────────────────────
  FOR country_rec IN SELECT * FROM _fp_countries ORDER BY c_sort LOOP

    INSERT INTO public.countries (collection_id, group_id, name, code, slug, sort_order)
    VALUES (col_id, country_rec.c_group_id, country_rec.c_name, country_rec.c_code, country_rec.c_slug, country_rec.c_sort)
    ON CONFLICT (collection_id, code) DO UPDATE SET
      name       = EXCLUDED.name,
      group_id   = EXCLUDED.group_id,
      sort_order = EXCLUDED.sort_order
    RETURNING id INTO c_id;

    FOR sticker_num IN 1..country_rec.c_count LOOP
      INSERT INTO public.stickers (collection_id, country_id, code, number, sort_order)
      VALUES (
        col_id,
        c_id,
        country_rec.c_code || '-' || LPAD(sticker_num::TEXT, 2, '0'),
        sticker_num,
        country_rec.c_start + sticker_num - 1
      )
      ON CONFLICT (collection_id, code) DO UPDATE SET sort_order = EXCLUDED.sort_order;
    END LOOP;

  END LOOP;

  -- ────────────────────────────────────────────────
  -- Estampas de sección: Estadios (1-16)
  -- ────────────────────────────────────────────────
  FOR sticker_num IN 1..16 LOOP
    INSERT INTO public.stickers (collection_id, section_id, code, number, name, sort_order)
    VALUES (
      col_id, sec_est_id,
      'EST-' || LPAD(sticker_num::TEXT, 2, '0'),
      sticker_num,
      'Estadio ' || sticker_num,
      sticker_num
    )
    ON CONFLICT (collection_id, code) DO UPDATE SET sort_order = EXCLUDED.sort_order;
  END LOOP;

  -- ────────────────────────────────────────────────
  -- Estampas de sección: Formaciones (17-40)
  -- ────────────────────────────────────────────────
  FOR sticker_num IN 1..24 LOOP
    INSERT INTO public.stickers (collection_id, section_id, code, number, name, sort_order)
    VALUES (
      col_id, sec_for_id,
      'FOR-' || LPAD(sticker_num::TEXT, 2, '0'),
      sticker_num,
      'Formación ' || sticker_num,
      16 + sticker_num
    )
    ON CONFLICT (collection_id, code) DO UPDATE SET sort_order = EXCLUDED.sort_order;
  END LOOP;

  -- ────────────────────────────────────────────────
  -- Estampas de sección: Cuadro de Honor (815-820)
  -- ────────────────────────────────────────────────
  FOR sticker_num IN 1..6 LOOP
    INSERT INTO public.stickers (collection_id, section_id, code, number, name, sort_order)
    VALUES (
      col_id, sec_cdh_id,
      'CDH-' || LPAD(sticker_num::TEXT, 2, '0'),
      sticker_num,
      'Cuadro de Honor ' || sticker_num,
      814 + sticker_num
    )
    ON CONFLICT (collection_id, code) DO UPDATE SET sort_order = EXCLUDED.sort_order;
  END LOOP;

  -- ────────────────────────────────────────────────
  -- Estampas de sección: Caras de la Copa (821-830)
  -- ────────────────────────────────────────────────
  FOR sticker_num IN 1..18 LOOP
    INSERT INTO public.stickers (collection_id, section_id, code, number, name, sort_order)
    VALUES (
      col_id, sec_cdc_id,
      'CDC-' || LPAD(sticker_num::TEXT, 2, '0'),
      sticker_num,
      'Cara de la Copa ' || sticker_num,
      820 + sticker_num
    )
    ON CONFLICT (collection_id, code) DO UPDATE SET sort_order = EXCLUDED.sort_order;
  END LOOP;

END $$;
