import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginPageComponent } from './login-page.component';
import { AuthService } from '../../../../core/auth.service';
import { SupabaseService } from '../../../../core/supabase.service';
import { ThemeService } from '../../../../core/theme.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let supabaseService: jasmine.SpyObj<SupabaseService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['signIn', 'isLoggedIn', 'signOut']);
    const supabaseSpy = jasmine.createSpyObj('SupabaseService', ['isConfigured']);
    const themeSpy = jasmine.createSpyObj('ThemeService', ['toggleTheme']);

    authSpy.signIn.and.returnValue(Promise.resolve({}));
    supabaseSpy.isConfigured.and.returnValue(true);
    themeSpy.theme = jasmine.createSpy('theme').and.returnValue('light');
    authSpy.isLoggedIn = jasmine.createSpy('isLoggedIn').and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: SupabaseService, useValue: supabaseSpy },
        { provide: ThemeService, useValue: themeSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({}) } }
        }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    supabaseService = TestBed.inject(SupabaseService) as jasmine.SpyObj<SupabaseService>;
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty email and password', () => {
    expect(component.email).toBe('');
    expect(component.password).toBe('');
  });

  it('should check if supabase is configured', () => {
    expect(component.supabaseConfigured()).toBe(true);
    expect(supabaseService.isConfigured).toHaveBeenCalled();
  });

  it('should call authService.signIn on submit with email and password', async () => {
    component.email = 'test@example.com';
    component.password = 'password123';

    await component.submit();

    expect(authService.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should clear error message on submit', async () => {
    component.error.set('Previous error');
    component.email = 'test@example.com';
    component.password = 'password123';

    await component.submit();

    expect(component.error()).toBe('');
  });

  it('should set error message when signIn returns error', async () => {
    authService.signIn.and.returnValue(Promise.resolve({ error: 'Invalid credentials' }));
    component.email = 'test@example.com';
    component.password = 'wrongpassword';

    await component.submit();

    expect(component.error()).toBe('Invalid credentials');
  });

  it('should not set error when signIn is successful', async () => {
    authService.signIn.and.returnValue(Promise.resolve({}));
    component.email = 'test@example.com';
    component.password = 'password123';

    await component.submit();

    expect(component.error()).toBe('');
  });

  it('should set error message when signIn returns error', async () => {
    authService.signIn.and.returnValue(Promise.resolve({ error: 'Invalid credentials' }));
    component.email = 'test@example.com';
    component.password = 'wrongpassword';

    await component.submit();

    expect(component.error()).toBe('Invalid credentials');
  });

  it('should not set error when signIn is successful', async () => {
    authService.signIn.and.returnValue(Promise.resolve({}));
    component.email = 'test@example.com';
    component.password = 'correctpassword';

    await component.submit();

    expect(component.error()).toBe('');
  });
});
