import { Component, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LayoutShellComponent } from './layout-shell.component';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { SupabaseService } from '../../core/supabase.service';
import { AuthService } from '../../core/auth.service';
import { ThemeService } from '../../core/theme.service';

@Component({
  standalone: true,
  imports: [LayoutShellComponent],
  template: `
    <app-layout-shell title="Test Title" subtitle="Test Subtitle">
      <p>Test Content</p>
    </app-layout-shell>
  `
})
class TestHostComponent {}

describe('LayoutShellComponent', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let layoutComponent: DebugElement;

  beforeEach(async () => {
    const supabaseSpy = jasmine.createSpyObj('SupabaseService', ['isConfigured']);
    supabaseSpy.isConfigured.and.returnValue(false);
    
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'signOut']);
    authSpy.isLoggedIn.and.returnValue(false);
    
    const themeSpy = jasmine.createSpyObj('ThemeService', ['toggleTheme']);
    themeSpy.theme = jasmine.createSpy('theme').and.returnValue('light');
    
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        { provide: SupabaseService, useValue: supabaseSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: ThemeService, useValue: themeSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({}) } }
        }
      ]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    layoutComponent = hostFixture.debugElement.query(By.directive(LayoutShellComponent));
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
    expect(layoutComponent).toBeTruthy();
  });

  it('should render projected content', () => {
    hostFixture.detectChanges();
    expect(hostFixture.nativeElement.textContent).toContain('Test Content');
  });

  it('should display title', () => {
    hostFixture.detectChanges();
    expect(hostFixture.nativeElement.textContent).toContain('Test Title');
  });

  it('should display subtitle', () => {
    hostFixture.detectChanges();
    expect(hostFixture.nativeElement.textContent).toContain('Test Subtitle');
  });

  it('should have standalone: true', () => {
    const metadata = (LayoutShellComponent as any).ɵcmp;
    expect(metadata.standalone).toBe(true);
  });
})

