export interface RsvpGuest {
  fullName: string;
  isPlusOne: boolean;
}

export interface RsvpEntry {
  id: string;
  /** Índice 0 é o titular (dono do celular); os demais são acompanhantes. */
  guests: RsvpGuest[];
  /** Apenas dígitos (DDD + número). */
  phone: string;
  confirmedAt: string;
}
