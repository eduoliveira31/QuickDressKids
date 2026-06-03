import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';
import { Favoritos } from './favoritos';

describe('Favoritos', () => {
  let service: Favoritos;
  let mockStorage: any;

  beforeEach(() => {
    mockStorage = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
        get: jasmine.createSpy('get').and.returnValue(Promise.resolve([])),
        set: jasmine.createSpy('set').and.returnValue(Promise.resolve())
      }))
    };

    TestBed.configureTestingModule({
      providers: [
        Favoritos,
        { provide: Storage, useValue: mockStorage }
      ]
    });
    service = TestBed.inject(Favoritos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
