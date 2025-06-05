import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { db } from '../database';
import { usuarios } from '../schema/usuarios';
import { eq } from 'drizzle-orm';

config(); 

async function seedSuperadmins() {
  const {
    SUPERADMIN_EMAIL_1,
    SUPERADMIN_PASSWORD_1,
    SUPERADMIN_CEDULA_1,
    SUPERADMIN_TELEFONO_1,
    SUPERADMIN_NOMBRE_1,
    SUPERADMIN_APELLIDO_1,
  } = process.env;

  if (!SUPERADMIN_EMAIL_1 || !SUPERADMIN_PASSWORD_1 || !SUPERADMIN_CEDULA_1|| !SUPERADMIN_TELEFONO_1 
    || !SUPERADMIN_NOMBRE_1 || !SUPERADMIN_APELLIDO_1
  ) {
    throw new Error('❌ Faltan variables de entorno para el superadmin');
  }

  const superadmins = [
    {
      email: SUPERADMIN_EMAIL_1,
      cedula: SUPERADMIN_CEDULA_1,
      password: SUPERADMIN_PASSWORD_1,
      telefono: SUPERADMIN_TELEFONO_1,
      nombre: SUPERADMIN_NOMBRE_1,
      apellido: SUPERADMIN_APELLIDO_1,
    },
  ];

  for (const user of superadmins) {
    const passwordHash = await bcrypt.hash(user.password, 10);

    const existing = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, user.email));

    if (existing.length === 0) {
      await db.insert(usuarios).values({
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        cedula: user.cedula,
        telefono: user.telefono,
        rol: 5,
        passwordHash,
        activo: true,
      });

      console.log(`✅ Superadmin creado: ${user.email}`);
    } else {
      console.log(`⚠️ Ya existe: ${user.email}, se omite.`);
    }
  }
}

seedSuperadmins()
  .then(() => {
    console.log('✅ Seed finalizado');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  });


  ///