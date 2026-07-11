export function normalizarRut(rut) {
  if (!rut) return "";

  // Quitar puntos y espacios
  rut = rut.replace(/\./g, "").replace(/\s+/g, "").toUpperCase();

  // Si ya viene con guion, lo dejamos
  if (rut.includes("-")) return rut;

  // Insertar guion antes del DV
  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1);

  return `${cuerpo}-${dv}`;
}

export function validarRut(rut) {
  if (!rut) return false;

  rut = normalizarRut(rut);

  if (rut.length < 3) return false;

  const [cuerpo, dv] = rut.split("-");

  if (!/^\d+$/.test(cuerpo)) return false;

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += multiplo * parseInt(cuerpo[i]);
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const dvEsperado = 11 - (suma % 11);

  const dvCalculado =
    dvEsperado === 11 ? "0" :
    dvEsperado === 10 ? "K" :
    dvEsperado.toString();

  return dvCalculado === dv;
}


