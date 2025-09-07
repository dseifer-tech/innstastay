import { normalizeSearchParams } from '../url';

describe('normalizeSearchParams', () => {
  it('should normalize checkin/check_in parameters', () => {
    const params = {
      checkin: '2024-08-27',
      checkout: '2024-08-28'
    };
    
    const result = normalizeSearchParams({ searchParams: params });
    
    expect(result.checkIn).toBe('2024-08-27');
    expect(result.checkOut).toBe('2024-08-28');
  });

  it('should normalize check_in/check_out parameters', () => {
    const params = {
      check_in: '2024-08-27',
      check_out: '2024-08-28'
    };
    
    const result = normalizeSearchParams({ searchParams: params });
    
    expect(result.checkIn).toBe('2024-08-27');
    expect(result.checkOut).toBe('2024-08-28');
  });

  it('should prefer checkin over check_in', () => {
    const params = {
      checkin: '2024-08-27',
      check_in: '2024-08-26',
      checkout: '2024-08-28',
      check_out: '2024-08-29'
    };
    
    const result = normalizeSearchParams({ searchParams: params });
    
    expect(result.checkIn).toBe('2024-08-27');
    expect(result.checkOut).toBe('2024-08-28');
  });

  it('should convert numeric parameters', () => {
    const params = {
      checkin: '2024-08-27',
      checkout: '2024-08-28',
      adults: '2',
      children: '1',
      rooms: '1'
    };
    
    const result = normalizeSearchParams({ searchParams: params });
    
    expect(result.adults).toBe(2);
    expect(result.children).toBe(1);
    expect(result.rooms).toBe(1);
  });

  it('should handle missing parameters gracefully', () => {
    const params = {};
    
    const result = normalizeSearchParams({ searchParams: params });
    
    expect(result.checkIn).toBeUndefined();
    expect(result.checkOut).toBeUndefined();
    expect(result.adults).toBeUndefined();
    expect(result.children).toBeUndefined();
    expect(result.rooms).toBeUndefined();
  });

  it('should handle partial parameters', () => {
    const params = {
      checkin: '2024-08-27',
      adults: '2'
    };
    
    const result = normalizeSearchParams({ searchParams: params });
    
    expect(result.checkIn).toBe('2024-08-27');
    expect(result.checkOut).toBeUndefined();
    expect(result.adults).toBe(2);
    expect(result.children).toBeUndefined();
    expect(result.rooms).toBeUndefined();
  });
});
