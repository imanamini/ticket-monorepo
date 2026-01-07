export let lastId = 0;

export function UniqueId(prefix = 'dpx_id_'): string {
  lastId++;

  return `${prefix}${lastId}`;
}
