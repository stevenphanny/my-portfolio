// Sanity project ID and dataset are public (they ship in the browser bundle),
// so commit defaults here. Env vars can still override them. Use `||` rather
// than `??` so an empty string (e.g. an unset GitHub Actions variable) falls back.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tqr4mt18'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
