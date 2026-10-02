import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'estadoLabel', standalone: true })
export class EstadoLabelPipe implements PipeTransform {
  private map: Record<string, string> = {
    'DISPONIBLE': 'Disponible',
    'POR_CONFIRMAR': 'Confirmar',
    'CONFIRMADO': 'Confirmado',
    'CANCELADO': 'Cancelado',
  };

  transform(estado: string): string {
    return this.map[estado] || estado;
  }
}
