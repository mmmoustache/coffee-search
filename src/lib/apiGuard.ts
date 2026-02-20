export function assertStrictApi(req: Request) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const ct = req.headers.get('content-type') ?? '';
    if (!ct.includes('application/json')) {
      throw Object.assign(new Error('blocked'), { status: 415 });
    }
  }

  const origin = req.headers.get('origin');
  const host = req.headers.get('host');

  if (origin && host) {
    const expectedHttps = `https://${host}`;
    const expectedHttp = `http://${host}`;
    if (origin !== expectedHttps && origin !== expectedHttp) {
      throw Object.assign(new Error('blocked'), { status: 403 });
    }
  }
}
