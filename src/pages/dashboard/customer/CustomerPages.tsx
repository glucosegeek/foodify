import React from 'react';
import { Heart, Bookmark, Bell, Settings, Users, Star } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

// CustomerFollowing.tsx
export function CustomerFollowing() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Obserwowane restauracje</h1>
        <p className="text-gray-600 mt-2">Zobacz najnowsze aktualności z obserwowanych miejsc</p>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Funkcja w budowie
          </h3>
          <p className="text-gray-600 mb-6">
            Wkrótce będziesz mógł śledzić aktualności z ulubionych restauracji.
          </p>
          <Button>Eksploruj restauracje</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// CustomerFavorites.tsx
export function CustomerFavorites() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Moje ulubione</h1>
        <p className="text-gray-600 mt-2">Zarządzaj swoimi listami ulubionych restauracji</p>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center">
          <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Funkcja w budowie
          </h3>
          <p className="text-gray-600 mb-6">
            Wkrótce będziesz mógł tworzyć listy ulubionych restauracji.
          </p>
          <Button>Dodaj ulubione</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// CustomerNotifications.tsx
export function CustomerNotifications() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Powiadomienia</h1>
        <p className="text-gray-600 mt-2">Śledź odpowiedzi, nowych obserwujących i aktualności</p>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center">
          <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Funkcja w budowie
          </h3>
          <p className="text-gray-600 mb-6">
            Wkrótce otrzymasz powiadomienia o wszystkich ważnych aktualnościach.
          </p>
          <Button>Sprawdź ustawienia</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// CustomerSettings.tsx
export function CustomerSettings() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ustawienia</h1>
        <p className="text-gray-600 mt-2">Zarządzaj swoim kontem i preferencjami</p>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center">
          <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Funkcja w budowie
          </h3>
          <p className="text-gray-600 mb-6">
            Wkrótce będziesz mógł dostosować wszystkie ustawienia konta.
          </p>
          <Button>Wróć do profilu</Button>
        </CardContent>
      </Card>
    </div>
  );
}