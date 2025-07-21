import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

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

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería abrir cliente de email con dirección correcta', () => {
    const testEmail = 'test@example.com';
    spyOn(component as any, 'navigateToLocation');

    component.openEmail(testEmail);

    expect((component as any).navigateToLocation).toHaveBeenCalledWith(`mailto:${testEmail}`);
  });

  it('debería abrir marcador telefónico con número correcto', () => {
    const testPhone = '+56912345678';
    spyOn(component as any, 'navigateToLocation');

    component.openPhone(testPhone);

    expect((component as any).navigateToLocation).toHaveBeenCalledWith(`tel:${testPhone}`);
  });
});
