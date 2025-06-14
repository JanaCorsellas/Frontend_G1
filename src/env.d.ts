interface ImportMetaEnv {
  readonly NG_APP_API_URL: string;
  // Ficar la resta de variables del .env aquí a mesura que facin falta
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}