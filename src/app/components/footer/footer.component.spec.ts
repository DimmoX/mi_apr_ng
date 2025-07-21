import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';

/**
 * Desarrollo de tests para componente Footer.
 */
describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  // Configuración del entorno de pruebas
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FooterComponent,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        RouterTestingModule
      ]
    }).compileComponents();

    // Creación del fixture y componente
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verificación de la creación del componente
  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // Se verifica que abra el servicio de email con el email correcto de la página.
  it('debería abrir cliente de email con dirección correcta', () => {
    const testEmail = 'test@example.com';
    spyOn(component as any, 'navigateToLocation');

    component.openEmail(testEmail);

    expect((component as any).navigateToLocation).toHaveBeenCalledWith(`mailto:${testEmail}`);
  });

  // Se verifica que abra el marcador telefónico con el número correcto de la página.
  it('debería abrir marcador telefónico con número correcto', () => {
    const testPhone = '+56912345678';
    spyOn(component as any, 'navigateToLocation');

    component.openPhone(testPhone);

    expect((component as any).navigateToLocation).toHaveBeenCalledWith(`tel:${testPhone}`);
  });
});
