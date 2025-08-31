"use client";

import { X, LogIn, ScanBarcode, CoinsIcon, Gift, Trophy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserDetails from "./UserDetails";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  totalPoints?: number;
}

export default function MobileMenu({
  isOpen,
  setIsOpen,
  totalPoints,
}: MobileMenuProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [errorMessage] = useState<string | null>(null);

  const { t } = useTranslation();

  const handleLinkClick = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };
  const handeEditClick = () => {
    navigate("/edit");
    setIsOpen(false);
  };

  useEffect(() => {
    if (!user) {
      setIsOpen(false);
    }
  }, [user, setIsOpen]);

  return (
    <div
      className={`fixed inset-0 transition-opacity duration-300 ease-in-out z-50 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setIsOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 w-[280px] h-full bg-white dark:bg-gray-800 shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-[1.8rem] right-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <div className="mb-10">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              EasyBonus
            </h1>
            <UserDetails user={user} totalPoints={totalPoints} />
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 text-sm">
              {errorMessage}
            </div>
          )}

          <div className="space-y-5 mb-10">
            <Link
              to="/"
              onClick={() => handleLinkClick("/")}
              className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <ScanBarcode className="w-5 h-5" />
              <span>{t("scan")}</span>
            </Link>
            <Link
              to="/bonuses"
              onClick={() => handleLinkClick("/bonuses")}
              className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <CoinsIcon className="w-5 h-5" />
              <span>{t("bonusArchive")}</span>
            </Link>
            <Link
              to="/tariffs"
              onClick={() => handleLinkClick("/tariffs")}
              className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <Trophy className="w-5 h-5" />
              <span>{t("rewards")}</span>
            </Link>
            <Link
              to="/prizes"
              onClick={() => handleLinkClick("/prizes")}
              className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <Gift className="w-5 h-5" />
              <span>{t("gotBonuses")}</span>
            </Link>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-5">
              {t("profile")}
            </h3>
            <button
              onClick={handeEditClick}
              className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
              <span>{t("editProfile")}</span>
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors mb-4"
              >
                <LogIn className="w-5 h-5" />
                <span>{t("logout")}</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => handleLinkClick("/login")}
                className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-4"
              >
                <LogIn className="w-5 h-5" />
                <span>{t("login")}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
