import React from 'react';
import { Store, Menu, MessageCircle, Users, Megaphone, BarChart3, Settings } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

// RestaurantProfile.tsx
export function RestaurantProfile() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profil restauracji</h1>
        <p className="text-gray-600 mt-2">Zarządzaj profilem, godzinami otwarcia i weryfikacją</p>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center">
          <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Funkcja w budowie
          </h3>
          <p className="text-gray-600 mb-6">
            Wkrótce będziesz mógł w pełni zarządzać profilem swojej restauracji.
          </p>
          <Button>Rozpocznij konfigurację</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// RestaurantMenu.tsx
export function RestaurantMenu() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Zarządzanie menu</h1>
        <p className="text-gray-600 mt-2">Dodawaj, edytuj i organizuj swoje dania</p>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center">
          <Menu className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Funkcja w budowie
          </h3>
          <p className="text-gray-600 mb-6">
            Wkrótce będziesz mógł zarządzać menu, cenami i zdjęciami dań.
          </p>
          <Button>Dodaj pierwsze danie</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// RestaurantReviews.tsx
export function RestaurantReviews() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Opinie i komentarze</h1>
        <p className="text-gray-600 mt-2">Odpowiadaj na opinie i zarządzaj recenzjami</p>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center">
          <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Funkcja w budowie
          </h3>
          <p className="text-gray-600 mb-6">
            Wkrótce będziesz mógł odpowiadać na recenzje klientów.
          </p>
          <Button>Zobacz opinie</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// RestaurantFollowers.tsx
export function RestaurantFollowers() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Obserwujący</h1>
        <p className="text-gray-600 mt-2">Zobacz kto obserwuje Twoją restaurację</p>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Funkcja w budowie
          </h3>
          <p className="text-gray-600 mb-6">
            Wkrótce będziesz mógł zobaczyć swoich obserwujących.
          </p>
          <Button>Zwiększ zasięg</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// RestaurantPosts.tsx
export function RestaurantPosts() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Promocje i ogłoszenia</h1>
        <p className="text-gray-600 mt-2">Publikuj promocje, wydarzenia i aktualności</p>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center">
          <Megaphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Funkcja w budowie
          </h3>
          <p className="text-gray-600 mb-6">
            Wkrótce będziesz mógł publikować promocje i wydarzenia.
          </p>
          <Button>Utwórz promocję</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// RestaurantAnalytics.tsx
export function RestaurantAnalytics() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Statystyki</h1>
        <p className="text-gray-600 mt-2">Analizuj wydajność i popularność restauracji</p>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Funkcja w budowie
          </h3>
          <p className="text-gray-600 mb-6">
            Wkrótce otrzymasz szczegółowe statystyki odwiedzin i popularności.
          </p>
          <Button>Zobacz przykład</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// RestaurantSettings.tsx
export function RestaurantSettings() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ustawienia konta</h1>
        <p className="text-gray-600 mt-2">Zarządzaj zespołem i ustawieniami restauracji</p>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center">
          <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Funkcja w budowie
          </h3>
          <p className="text-gray-600 mb-6">
            Wkrótce będziesz mógł zarządzać zespołem i ustawieniami.
          </p>
          <Button>Skonfiguruj konto</Button>
        </CardContent>
      </Card>
    </div>
  );
}