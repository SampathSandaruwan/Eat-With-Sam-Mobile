import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFormik } from 'formik';

import { Icon, Text } from '@components';
import { useAuthStore } from '@store';
import { colors } from '@theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  onNavigateToSignup: () => void;
};

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginModal({ visible, onClose, onNavigateToSignup }: Props) {
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error: authError } = useAuthStore();

  const {
    resetForm: resetLoginForm,
    values: loginFormValues,
    touched: loginFormTouched,
    isValid: loginFormIsValid,
    errors: loginFormErrors,
    handleChange: handleLoginFormChange,
    handleBlur: handleLoginFormBlur,
    handleSubmit: handleLoginFormSubmit,
  } = useFormik<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors: Partial<Record<keyof LoginFormValues, string>> = {};

      if (!values.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = 'Please enter a valid email';
      }

      if (!values.password) {
        errors.password = 'Password is required';
      } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        await login({ email: values.email.trim(), password: values.password });

        resetLoginForm();

        setTimeout(() => {
          onClose();
        }, 500);
      } catch {
        // Error handled by store
      }
    },
  });

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 20) }]}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="XIcon" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text size="heading1" weight="bolder" color="primary" style={styles.title}>
                Log in
              </Text>
              <Text size="body" color="secondary" style={styles.subtitle}>
                Enter your email and password to continue
              </Text>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text size="body" weight="medium" color="primary" style={styles.label}>
                  Email
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    loginFormErrors.email && loginFormTouched.email && styles.inputError,
                  ]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textInactive}
                  value={loginFormValues.email}
                  onChangeText={handleLoginFormChange('email')}
                  onBlur={handleLoginFormBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                {loginFormErrors.email && loginFormTouched.email && (
                  <Text size="small" color="danger" style={styles.errorText}>
                    {loginFormErrors.email}
                  </Text>
                )}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text size="body" weight="medium" color="primary" style={styles.label}>
                  Password
                </Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.passwordInput,
                      loginFormErrors.password && loginFormTouched.password && styles.inputError,
                    ]}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textInactive}
                    value={loginFormValues.password}
                    onChangeText={handleLoginFormChange('password')}
                    onBlur={handleLoginFormBlur('password')}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Icon
                      name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'}
                      size={20}
                      color={colors.textSecondary}
                    />
                  </Pressable>
                </View>
                {loginFormErrors.password && loginFormTouched.password && (
                  <Text size="small" color="danger" style={styles.errorText}>
                    {loginFormErrors.password}
                  </Text>
                )}
              </View>

              {/* Auth Error */}
              {authError && (
                <View style={styles.authErrorContainer}>
                  <Text size="body" color="danger">
                    {authError}
                  </Text>
                </View>
              )}

              {/* Login Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  (isLoading || !loginFormIsValid) && styles.loginButtonDisabled,
                ]}
                onPress={() => handleLoginFormSubmit()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text size="body" weight="bold" color="primaryInverted">
                    Log in
                  </Text>
                )}
              </TouchableOpacity>

              {/* Sign up Link */}
              <View style={styles.signupContainer}>
                <Text size="body" color="secondary">
                  Don&apos;t have an account?{' '}
                </Text>
                <Pressable onPress={onNavigateToSignup}>
                  <Text size="body" weight="bold" color="brandColor">
                    Sign up
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  authErrorContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: 16,
    marginTop: 8,
    padding: 12,
  },
  closeButton: {
    padding: 4,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  errorText: {
    marginTop: 4,
  },
  eyeIcon: {
    padding: 4,
    position: 'absolute',
    right: 16,
    top: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 8,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputError: {
    borderColor: colors.danger,
  },
  keyboardView: {
    flex: 1,
  },
  label: {
    marginBottom: 8,
  },
  loginButton: {
    alignItems: 'center',
    backgroundColor: colors.brandYellow,
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 16,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  scrollContent: {
    flexGrow: 1,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  subtitle: {
    marginBottom: 32,
  },
  title: {
    marginBottom: 8,
  },
});

