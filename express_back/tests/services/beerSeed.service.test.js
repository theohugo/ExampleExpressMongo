import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import beerSeedService from '../../src/service/beerSeed.service.js';
import beerRepository from '../../src/repositories/beer.repository.js';

test('beerSeed.seedIfEmpty skips when collection already has data', async () => {
    const originalCountAll = beerRepository.countAll;
    const originalCreateMany = beerRepository.createMany;

    let createManyCalled = false;
    beerRepository.countAll = async () => 5;
    beerRepository.createMany = async () => {
        createManyCalled = true;
    };

    try {
        await beerSeedService.seedIfEmpty();
        assert.equal(createManyCalled, false);
    } finally {
        beerRepository.countAll = originalCountAll;
        beerRepository.createMany = originalCreateMany;
    }
});

test('beerSeed.seedIfEmpty skips when dataset is missing', async () => {
    const originalCountAll = beerRepository.countAll;
    const originalCreateMany = beerRepository.createMany;
    const originalExistsSync = fs.existsSync;

    let createManyCalled = false;
    beerRepository.countAll = async () => 0;
    beerRepository.createMany = async () => {
        createManyCalled = true;
    };
    fs.existsSync = () => false;

    try {
        await beerSeedService.seedIfEmpty();
        assert.equal(createManyCalled, false);
    } finally {
        beerRepository.countAll = originalCountAll;
        beerRepository.createMany = originalCreateMany;
        fs.existsSync = originalExistsSync;
    }
});

test('beerSeed.seedIfEmpty inserts parsed beers from dataset', async () => {
    const originalCountAll = beerRepository.countAll;
    const originalCreateMany = beerRepository.createMany;
    const originalCwd = process.cwd();

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'beer-seed-test-'));
    const datasetDir = path.join(tmpDir, 'mongodb', 'dataset');
    fs.mkdirSync(datasetDir, { recursive: true });
    const datasetPath = path.join(datasetDir, 'beer.json');

    fs.writeFileSync(
        datasetPath,
        [
            JSON.stringify({
                couleur: 'Blonde',
                nom_article: 'Test Beer',
                nom_marque: 'Brand',
                prix_ht: 1.1,
                prix_15: 2.2,
                titrage: 5,
                type: 'Ale',
                volume: 33,
            }),
            'invalid-json-line',
            JSON.stringify({
                nom_article: 'Beer 2',
                nom_marque: 'Brand2',
                prix_ht: 3.3,
                prix_15: 4.4,
                titrage: 6,
                volume: 50,
            }),
        ].join('\n'),
        'utf8'
    );

    let inserted = null;
    beerRepository.countAll = async () => 0;
    beerRepository.createMany = async (docs) => {
        inserted = docs;
    };

    try {
        process.chdir(tmpDir);
        await beerSeedService.seedIfEmpty();

        assert.ok(Array.isArray(inserted));
        assert.equal(inserted.length, 2);
        assert.equal(inserted[0].nom_article, 'Test Beer');
        assert.equal(inserted[1].nom_article, 'Beer 2');
    } finally {
        process.chdir(originalCwd);
        beerRepository.countAll = originalCountAll;
        beerRepository.createMany = originalCreateMany;
        fs.rmSync(tmpDir, { recursive: true, force: true });
    }
});
