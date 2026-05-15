/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    window.location.href = '/sitta-praktik/index.html';
  }, []);

  return <div>Mengalihkan ke preview tugas SITTA UT...</div>;
}
