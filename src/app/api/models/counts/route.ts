import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const models = await prisma.modelProfile.findMany({
      where: {
        isVerified: true,
        isActive: true,
      },
      select: {
        age: true,
        ethnicity: true,
        bodyType: true,
        hairColor: true,
        isFeatured: true,
        country: true,
      }
    });

    const counts: any = {
      specials: {
        worldTournament: 0,
        african: 0,
        ukrainian: 0,
        newModels: 0,
        vrCams: 0,
        bdsm: 0,
      },
      age: {
        teen: 0, // 18-21
        young: 0, // 22-29
        milf: 0, // 30-39
        mature: 0, // 40-49
        granny: 0, // 50+
      },
      ethnicity: {
        Arab: 0,
        Asian: 0,
        Ebony: 0,
        Indian: 0,
        Latina: 0,
        Mixed: 0,
        White: 0,
      },
      bodyType: {
        Slim: 0,
        Athletic: 0,
        Curvy: 0,
        "Big Breast": 0,
        Plump: 0,
      },
      hairColor: {
        Blonde: 0,
        Brunette: 0,
        Black: 0,
        Redhead: 0,
        Bald: 0,
      }
    };

    models.forEach(model => {
      // Age group
      if (model.age >= 18 && model.age <= 21) counts.age.teen++;
      else if (model.age >= 22 && model.age <= 29) counts.age.young++;
      else if (model.age >= 30 && model.age <= 39) counts.age.milf++;
      else if (model.age >= 40 && model.age <= 49) counts.age.mature++;
      else if (model.age >= 50) counts.age.granny++;

      // Ethnicity
      if (model.ethnicity && model.ethnicity in counts.ethnicity) {
        counts.ethnicity[model.ethnicity as any]++;
      }

      // Body Type
      if (model.bodyType && model.bodyType in counts.bodyType) {
        counts.bodyType[model.bodyType as any]++;
      }

      // Hair Color
      if (model.hairColor && model.hairColor in counts.hairColor) {
        counts.hairColor[model.hairColor as any]++;
      }

      // Specials
      if (model.isFeatured) counts.specials.worldTournament++;
      if (model.country === 'Ukraine') counts.specials.ukrainian++;
      
      const africanCountries = [
        "Nigeria", "South Africa", "Kenya", "Egypt", "Morocco", "Ghana", "Ethiopia", 
        "Tanzania", "Uganda", "Rwanda", "Burundi", "Senegal", "Ivory Coast", "Algeria", 
        "Tunisia", "Cameroon", "DR Congo", "Zambia", "Zimbabwe", "Botswana", "Namibia", 
        "Mozambique", "Angola", "Mauritius", "Seychelles"
      ];
      if (africanCountries.includes(model.country)) {
        counts.specials.african++;
      }
      
      counts.specials.newModels++;
    });

    // Mock count offsets for less populated lists
    counts.specials.vrCams = Math.floor(models.length * 0.1) + 2;
    counts.specials.bdsm = Math.floor(models.length * 0.05) + 1;

    return NextResponse.json(counts);
  } catch (error) {
    console.error('Error fetching model counts:', error);
    return NextResponse.json({ error: 'Failed to count models' }, { status: 500 });
  }
}
