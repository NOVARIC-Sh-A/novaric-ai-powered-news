import { mediaProfilesData } from '../data/mediaProfiles';
import { formatPersonName } from '../utils/formatPersonName';

const rows = mediaProfilesData.map((profile) => ({
  slug: profile.slug || '',
  name: formatPersonName(profile.name) || profile.name,
  role: (profile.primaryRole || 'Profil mediatik').trim(),
}));

process.stdout.write(JSON.stringify(rows));
