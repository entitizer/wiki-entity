
import { getEntityType } from './getEntityType';
import { getEntityType as getEntityInstanceType } from './getEntityInstanceType';
import { getEntityTypeByExtract } from './getEntityTypeByExtract';
import { getEntityData } from './getEntityData';
import { getEntityCountryCode } from './getEntityCountry';
import { uniq } from '../utils';
import { SimpleEntityType, SimpleEntity } from './simpleEntity';
import { WikiEntity } from '../types';

export type WikiEntityToEntityOptions = {
    defaultType?: SimpleEntityType
}

export function convertToSimpleEntity(wikiEntity: WikiEntity, lang: string, options?: WikiEntityToEntityOptions): SimpleEntity {
    // debug('wikiEntityToEntity:', lang, wikiEntity);
    options = options || {};
    const entity: SimpleEntity = {};
    entity.lang = lang.toLowerCase();
    entity.wikiDataId = wikiEntity.id;
    entity.name = wikiEntity.label;
    entity.description = wikiEntity.description;
    entity.wikiPageId = wikiEntity.pageid;
    entity.about = wikiEntity.extract;
    if (wikiEntity.types) {
        entity.types = uniq(wikiEntity.types.filter(item => !/:(Thing|Agent)$/.test(item)));
    }
    entity.type = getEntityType(wikiEntity);
    if (!entity.type) {
        entity.type = getEntityInstanceType(wikiEntity);
        if (!entity.type && entity.about && !entity.types) {
            entity.type = getEntityTypeByExtract(entity.about, lang);
        }
        if (!entity.type && options.defaultType) {
            entity.type = options.defaultType;
        }
    }

    if (wikiEntity.sitelinks) {
        entity.wikiPageTitle = wikiEntity.sitelinks[lang];
    }

    // entity.aliases = createAliases(wikiEntity);
    entity.categories = createCategories(wikiEntity);

    if (wikiEntity.claims) {
        const ids = Object.keys(wikiEntity.claims);
        if (ids.length) {
            entity.data = getEntityData(wikiEntity);
        }

        entity.countryCode = getEntityCountryCode(wikiEntity);
    }

    return entity;
}

function createAliases(entity: WikiEntity) {
    let aliases = entity.aliases || [];
    // aliases = aliases.concat(entity.redirects || []);
    return uniq(aliases);
}

function createCategories(entity: WikiEntity) {
    let categories = entity.categories || [];
    return uniq(categories);
}
