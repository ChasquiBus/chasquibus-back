import { db } from '../database';
import { provincias, ciudades } from '../schema/ciudades';
import { eq } from 'drizzle-orm';

async function seedCiudades() {
  const data = [
    {
      nombre: 'Carchi',
      ciudades: [{ ciudad: 'Tulcán', codigo: 'TULC' }],
    },
    {
      nombre: 'Imbabura',
      ciudades: [{ ciudad: 'Ibarra', codigo: 'IBAR' }],
    },
    {
      nombre: 'Pichincha',
      ciudades: [{ ciudad: 'Quito', codigo: 'QUIT' }],
    },
    {
      nombre: 'Cotopaxi',
      ciudades: [{ ciudad: 'Latacunga', codigo: 'LATI' }],
    },
    {
      nombre: 'Tungurahua',
      ciudades: [
        { ciudad: 'Ambato', codigo: 'AMB' },
        { ciudad: 'Baños', codigo: 'BAN' }
      ],
    },
    {
      nombre: 'Chimborazo',
      ciudades: [{ ciudad: 'Riobamba', codigo: 'RIOB' }],
    },
    {
      nombre: 'Cañar',
      ciudades: [{ ciudad: 'Azogues', codigo: 'AZOG' }],
    },
    {
      nombre: 'Azuay',
      ciudades: [{ ciudad: 'Cuenca', codigo: 'CUEN' }],
    },
    {
      nombre: 'Loja',
      ciudades: [
        { ciudad: 'Loja', codigo: 'LOJA' },
        { ciudad: 'Catamayo', codigo: 'CATA' },
        { ciudad: 'Saraguro', codigo: 'SARA' },
      ],
    },
    {
      nombre: 'Santo Domingo de los Tsáchilas',
      ciudades: [{ ciudad: 'Santo Domingo', codigo: 'STDO' }],
    },
    {
      nombre: 'Los Ríos',
      ciudades: [
        { ciudad: 'Babahoyo', codigo: 'BABH' },
        { ciudad: 'Quevedo', codigo: 'QUEV' },
        { ciudad: 'Buena Fe', codigo: 'BUEF' },
        { ciudad: 'Ventanas', codigo: 'VTAS' },
      ],
    },
    {
      nombre: 'Guayas',
      ciudades: [
        { ciudad: 'Guayaquil', codigo: 'GYE' },
        { ciudad: 'Durán', codigo: 'DURA' },
        { ciudad: 'Milagro', codigo: 'MILA' },
        { ciudad: 'Daule', codigo: 'DAUL' },
        { ciudad: 'Naranjal', codigo: 'NARA' },
      ],
    },
    {
      nombre: 'Manabí',
      ciudades: [
        { ciudad: 'Manta', codigo: 'MANT' },
        { ciudad: 'Portoviejo', codigo: 'PORT' },
        { ciudad: 'Montañita', codigo: 'MONI' },
      ],
    },
    {
      nombre: 'Esmeraldas',
      ciudades: [
        { ciudad: 'Esmeraldas', codigo: 'ESME' },
        { ciudad: 'Atacames', codigo: 'ATAC' },
        { ciudad: 'San Lorenzo', codigo: 'SLOR' },
      ],
    },
    {
      nombre: 'El Oro',
      ciudades: [
        { ciudad: 'Machala', codigo: 'MACH' },
        { ciudad: 'Pasaje', codigo: 'PASA' },
        { ciudad: 'Santa Rosa', codigo: 'STRO' },
      ],
    },
    {
      nombre: 'Sucumbíos',
      ciudades: [
        { ciudad: 'Lago Agrio', codigo: 'LGRA' },
        { ciudad: 'Nueva Lago', codigo: 'LAGO' },
        { ciudad: 'Puerto El Coca', codigo: 'ELCO' },
      ],
    },
    {
      nombre: 'Napo',
      ciudades: [
        { ciudad: 'Tena', codigo: 'TENA' },
        { ciudad: 'Puyo', codigo: 'PUYO' },
        { ciudad: 'Archidona', codigo: 'ARCH' },
      ],
    },
  ];

  for (const provincia of data) {
    const existingProvincia = await db.query.provincias.findFirst({
      where: eq(provincias.nombre, provincia.nombre),
    });

    let provinciaId: number;

    if (!existingProvincia) {
      const result = await db.insert(provincias).values({ nombre: provincia.nombre }).returning();
      provinciaId = result[0].id;
    } else {
      provinciaId = existingProvincia.id;
    }

    for (const ciudad of provincia.ciudades) {
      const existingCiudad = await db.query.ciudades.findFirst({
        where: (row) =>
          eq(row.ciudad, ciudad.ciudad) &&
          eq(row.provincia_id, provinciaId),
      });

      if (!existingCiudad) {
        await db.insert(ciudades).values({
          ciudad: ciudad.ciudad,
          codigo: ciudad.codigo,
          provincia_id: provinciaId,
        });
      }
    }
  }

  console.log('✅ Provincias y ciudades insertadas exitosamente');
}

seedCiudades().catch((err) => {
  console.error('❌ Error en el seed de ciudades:', err);
  process.exit(1);
});
