// interface CacheEntry<T> {
//     data: T;
//     timestamp: number;
//     expiresAt: number;
// }

// class PredictionCache {
//     private cache = new Map<string, CacheEntry<any>>();
//     private defaultTTL = 5 * 60 * 1000;

//     set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
//         const timestamp = Date.now();
//         this.cache.set(key, {
//             data,
//             timestamp,
//             expiresAt: timestamp + ttl
//         });

//         console.log('📦 Cache set for:', key);
//     }

//     get<T>(key: string): T | null {
//         const entry = this.cache.get(key);

//         if (!entry) {
//             console.log('📦 Cache miss for:', key);
//             return null;
//         }

//         if (Date.now() > entry.expiresAt) {
//             console.log('📦 Cache expired for:', key);
//             this.cache.delete(key);
//             return null;
//         }

//         console.log('📦 Cache hit for:', key);
//         return entry.data;
//     }

//     delete(key: string): boolean {
//         return this.cache.delete(key);
//     }

//     clear(): void {
//         this.cache.clear();
//         console.log('📦 Cache cleared');
//     }

//     // Get cache stats for debugging
//     getStats() {
//         const now = Date.now();
//         const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
//             key,
//             age: now - entry.timestamp,
//             expiresIn: entry.expiresAt - now,
//             isExpired: now > entry.expiresAt
//         }));

//         return {
//             total: this.cache.size,
//             entries
//         };
//     }
// }

// export const predictionCache = new PredictionCache();