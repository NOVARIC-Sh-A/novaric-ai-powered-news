/** stdin: JSON string[]. stdout: JSON string[] in the same order, via formatPersonName. */
import fs from 'node:fs';
import { formatPersonName } from '../utils/formatPersonName';

const names = JSON.parse(fs.readFileSync(0, 'utf8')) as string[];
process.stdout.write(JSON.stringify(names.map((name) => formatPersonName(name))));
