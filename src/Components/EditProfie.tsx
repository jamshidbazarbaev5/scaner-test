import {useChangePassword} from "../api/user.ts";
import {useState, useEffect} from "react";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

export const EditProfie = () => {
    const {user, setUser} = useAuth();
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState(user?.first_name || "");
    const [lastName, setLastName] = useState(user?.last_name || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [message, setMessage] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");

    const {t} = useTranslation();

    const changePassword = useChangePassword();

    useEffect(() => {
        if (user) {
            setFirstName(user.first_name || "");
            setLastName(user.last_name || "");
            setPhone(user.phone || "");
        }
    }, [user]);

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            // const response = await editUser.mutateAsync({
            //     first_name: firstName,
            //     last_name: lastName,
            //     phone: phone
            // });

            const updatedUser = {
                ...user,
                first_name: firstName,
                last_name: lastName,
                phone: phone,
            };

            localStorage.setItem("userData", JSON.stringify(updatedUser));
            setUser(updatedUser);

            if (newPassword) {
                await handlePasswordChange();
            } else {
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            }
        } catch (err) {
            console.error(err);
            setMessage("Ошибка при обновлении профиля.");
        }
    };

    const handlePasswordChange = async () => {
        if (!newPassword) return;

        try {
            await changePassword.mutateAsync({
                new_password: newPassword,
            });
            setPasswordMessage("Пароль успешно изменен.");
            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (err) {
            console.error(err);
            setPasswordMessage("Ошибка при изменении пароля.");
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {t("editProfile")}
            </h2>

            {message && (
                <div className="mb-4 p-3 rounded bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200">
                    {message}
                </div>
            )}

            {passwordMessage && (
                <div className="mb-4 p-3 rounded bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200">
                    {passwordMessage}
                </div>
            )}

            <form onSubmit={handleEdit} className="space-y-4">
                <div className="space-y-4">
                    <input
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder={t("name")}
                        value={firstName}
                    />
                    <input
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder={t("last_name")}
                        value={lastName}
                    />
                    <input
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t("phone")}
                        value={phone}
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600
                                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                                     focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                                     pr-24"
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder={t("newPassword")}
                            value={newPassword}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2
                                     px-2 py-1 text-sm text-gray-500 dark:text-gray-400
                                     hover:text-gray-700 dark:hover:text-gray-200
                                     focus:outline-none"
                        >
                            {showPassword ? t("hide") : t("show")}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700
                             text-white font-medium transition-colors
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    {t("updateProfile")}
                </button>
            </form>
        </div>
    );
};
