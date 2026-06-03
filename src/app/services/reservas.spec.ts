import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';
import { ReservasService } from './reservas';
import { AuthService } from './auth.service';

describe('ReservasService', () => {
  let service: ReservasService;
  let mockStorage: any;
  let mockAuthService: any;

  beforeEach(() => {
    mockStorage = {
      create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
        get: jasmine.createSpy('get').and.returnValue(Promise.resolve([])),
        set: jasmine.createSpy('set').and.returnValue(Promise.resolve()),
        remove: jasmine.createSpy('remove').and.returnValue(Promise.resolve())
      }))
    };

    mockAuthService = {
      getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ username: 'joao' })
    };

    TestBed.configureTestingModule({
      providers: [
        ReservasService,
        { provide: Storage, useValue: mockStorage },
        { provide: AuthService, useValue: mockAuthService }
      ]
    });
    service = TestBed.inject(ReservasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
