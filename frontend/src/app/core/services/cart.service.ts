import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly STORAGE_KEY = 'cart';
  items = signal<CartItem[]>([]);

  totalItems = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0),
  );

  totalAmount = computed(() =>
    this.items().reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  );

  constructor() {
    this.loadFromStorage();
  }

  addItem(item: CartItem): void {
    const currentItems = this.items();
    const existingItem = currentItems.find(
      (i) => i.productId === item.productId,
    );

    if (existingItem) {
      this.updateQuantity(
        item.productId,
        existingItem.quantity + item.quantity,
      );
    } else {
      this.items.set([...currentItems, item]);
      this.saveToStorage();
    }
  }

  removeItem(productId: number): void {
    const filtered = this.items().filter(
      (item) => item.productId !== productId,
    );
    this.items.set(filtered);
    this.saveToStorage();
  }

  updateQuantity(productId: number, quantity: number): void {
    const updated = this.items().map((item) =>
      item.productId === productId
        ? { ...item, quantity: Math.max(1, quantity) }
        : item,
    );
    this.items.set(updated);
    this.saveToStorage();
  }

  clearCart(): void {
    this.items.set([]);
    this.saveToStorage();
  }

  // Persists the cart in localStorage because the MVP requires client-side cart storage.
  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items()));
  }

  // Restores the cart state on service initialization so the user keeps the cart after refresh.
  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.items.set(Array.isArray(parsed) ? parsed : []);
      } catch {
        this.items.set([]);
      }
    }
  }
}
