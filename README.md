# wiki-entity

Wiki(pedia/data) entity extractor.

## Usage

```
import { getEntities } from 'wiki-entity';

// get Europe by title
getEntities({ language: 'en', titles: 'Europe' }).then(entities => {});

// get Europe by id
getEntities({ language: 'en', ids: 'Q46' }).then(entities => {});
```

## API

### getEntities(params): Promise<WikiEntity[]>

Gets entities from wikidata and wikipedia.

#### params

Required. `ids` or `titles` require. Params properties:

- **ids** :*string* - wikidata ids separated by a `|`; (max 200)
- **titles** :*string* - wikipedia article titles separated by a `|`; (max 200)
- **language** :*string* - language of `titles` param and of the result object info; default: `en`
- **props** :*string* - entity props to get. Can by: `info`|`sitelinks`|`aliases`|`labels`|`descriptions`|`claims`|`datatype`;
- **claims** :*string* - How to resolve the claims. Can be: `none`, `all`, `item`, `property`. Default: `none`. `all` resolves `item` and `property` types.
- **extract** :*number* - Sentences in the extract. Default: `0`. Works only if `sitelinks` is present.
- **types** :*boolean* | *string*[] - `true` to get entity types. Filter types by [prefixes](https://dbpedia.org/sparql?nsdecl). Example: [`dbo`, `schema`] will return only types defined by `dbpedia.org/ontology/` and `schema.org`. Default: `false`.
- **redirects** : *boolean* - get wikipedia redirects titles. Default: `false`. Works only if `sitelinks` is present.
- **categories** : *boolean* - get wikipedia article categories. Default: `false`. Works only if `sitelinks` is present.

### convertToSimpleEntity(wikiEntity: WikiEntity): SimpleEntity

Convert a complex WikiEntity object to SimpleEntity object.

## WikiEntity

`WikiEntity` is a simple version of an item returned by Wikidata API. It also may include some extra properties from Wikipadia API.

```ts

type WikiEntity = {
    id: string;
    label?: string;
    description?: string;
    extract?: string;
    pageid?: number;
    aliases?: string[];
    sitelinks?: IIndexType<string>;
    claims?: IIndexType<WikidataProperty>;
    types?: string[];
    redirects?: string[];
    categories?: string[];
}

type WikidataProperty = {
    id: string;
    label?: string;
    description?: string;
    values: WikidataPropertyValue[];
}

type WikidataPropertyValue = {
    datatype: string;
    value: any;
    pageid?: number;
    value_string?: string;
    label?: string;
    description?: string;
}

type IIndexType<T> = {
    [index: string]: T
}

```

## SimpleEntity

```ts

export enum SimpleEntityType {
    EVENT = 'E',
    ORG = 'O',
    PERSON = 'H',
    PLACE = 'P',
    PRODUCT = 'R',
}

export type SimpleEntityData = { [prop: string]: string[] }

export type SimpleEntity = {
    id?: string
    lang?: string
    wikiDataId?: string
    name?: string
    abbr?: string
    description?: string
    about?: string
    wikiPageId?: number
    wikiPageTitle?: string
    type?: SimpleEntityType
    types?: string[]
    countryCode?: string
    data?: SimpleEntityData
    categories?: string[]
}

```
