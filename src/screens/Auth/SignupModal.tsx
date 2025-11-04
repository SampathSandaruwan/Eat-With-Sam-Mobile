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
  onNavigateToLogin: () => void;
};

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export default function SignupModal({ visible, onClose, onNavigateToLogin }: Props) {
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signup, isLoading, error: authError } = useAuthStore();

  // Password policy validation helpers
  const checkPasswordPolicy = (pwd: string) => {
    return {
      minLength: pwd.length >= 8,
      hasLowercase: /[a-z]/.test(pwd),
      hasUppercase: /[A-Z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd),
    };
  };

  const {
    resetForm: resetSignupForm,
    values: signupFormValues,
    touched: signupFormTouched,
    isValid: signupFormIsValid,
    errors: signupFormErrors,
    handleChange: handleSignupFormChange,
    handleBlur: handleSignupFormBlur,
    handleSubmit: handleSignupFormSubmit,
    setFieldValue: setSignupFormFieldValue,
    setFieldTouched: setSignupFormFieldTouched,
  } = useFormik<SignupFormValues>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    validate: (values) => {
      const errors: Partial<Record<keyof SignupFormValues, string>> = {};

      if (!values.name.trim()) {
        errors.name = 'Name is required';
      } else if (values.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters';
      }

      if (!values.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = 'Please enter a valid email';
      }

      if (!values.password) {
        errors.password = 'Password is required';
      } else {
        const passwordPolicy = checkPasswordPolicy(values.password);
        if (!passwordPolicy.minLength || !passwordPolicy.hasLowercase || !passwordPolicy.hasUppercase || !passwordPolicy.hasNumber || !passwordPolicy.hasSpecialChar) {
          errors.password = 'Password does not meet requirements';
        }
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }

      if (!values.acceptTerms) {
        errors.acceptTerms = 'You must accept the terms and conditions';
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        await signup({
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
        });
        resetSignupForm();
        onClose();
      } catch {
        // Error handled by store
      }
    },
  });

  const passwordPolicy = checkPasswordPolicy(signupFormValues.password);

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
              <Text size="heading1" weight="bold" color="primary" style={styles.title}>
                Sign up
              </Text>
              <Text size="body" color="secondary" style={styles.subtitle}>
                Create an account to get started
              </Text>

              {/* Name Input */}
              <View style={styles.inputContainer}>
                <Text size="body" weight="medium" color="primary" style={styles.label}>
                  Name
                </Text>
                <TextInput
                  style={[styles.input, signupFormErrors.name && signupFormTouched.name && styles.inputError]}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.textInactive}
                  value={signupFormValues.name}
                  onChangeText={handleSignupFormChange('name')}
                  onBlur={handleSignupFormBlur('name')}
                  autoCapitalize="words"
                  autoComplete="name"
                  autoCorrect={false}
                />
                {signupFormErrors.name && signupFormTouched.name && (
                  <Text size="small" color="danger" style={styles.errorText}>
                    {signupFormErrors.name}
                  </Text>
                )}
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text size="body" weight="medium" color="primary" style={styles.label}>
                  Email
                </Text>
                <TextInput
                  style={[styles.input, signupFormErrors.email && signupFormTouched.email && styles.inputError]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textInactive}
                  value={signupFormValues.email}
                  onChangeText={handleSignupFormChange('email')}
                  onBlur={handleSignupFormBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                />
                {signupFormErrors.email && signupFormTouched.email && (
                  <Text size="small" color="danger" style={styles.errorText}>
                    {signupFormErrors.email}
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
                    style={[styles.input, styles.passwordInput, signupFormErrors.password && signupFormTouched.password && styles.inputError]}
                    placeholder="Create a password"
                    placeholderTextColor={colors.textInactive}
                    value={signupFormValues.password}
                    onChangeText={(text) => {
                      handleSignupFormChange('password')(text);
                    }}
                    onBlur={handleSignupFormBlur('password')}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    textContentType="none"
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
                {signupFormErrors.password && signupFormTouched.password && (
                  <Text size="small" color="danger" style={styles.errorText}>
                    {signupFormErrors.password}
                  </Text>
                )}
                {/* Password Policy */}
                <View style={styles.passwordPolicyContainer}>
                  <Text size="small" color="secondary" style={styles.policyTitle}>
                    Password must contain:
                  </Text>
                  <View style={styles.policyList}>
                    <View style={styles.policyItem}>
                      {passwordPolicy.minLength ? (
                        <Icon
                          name="CheckIcon"
                          size={16}
                          color={colors.success}
                          weight="fill"
                        />
                      ) : (
                        <View style={styles.policyIconUnmet} />
                      )}
                      <Text
                        size="small"
                        color={passwordPolicy.minLength ? 'secondary' : 'inactive'}
                        style={styles.policyText}
                      >
                        8 characters
                      </Text>
                    </View>
                    <View style={styles.policyItem}>
                      {passwordPolicy.hasLowercase ? (
                        <Icon
                          name="CheckIcon"
                          size={16}
                          color={colors.success}
                          weight="fill"
                        />
                      ) : (
                        <View style={styles.policyIconUnmet} />
                      )}
                      <Text
                        size="small"
                        color={passwordPolicy.hasLowercase ? 'secondary' : 'inactive'}
                        style={styles.policyText}
                      >
                        One lowercase letter
                      </Text>
                    </View>
                    <View style={styles.policyItem}>
                      {passwordPolicy.hasUppercase ? (
                        <Icon
                          name="CheckIcon"
                          size={16}
                          color={colors.success}
                          weight="fill"
                        />
                      ) : (
                        <View style={styles.policyIconUnmet} />
                      )}
                      <Text
                        size="small"
                        color={passwordPolicy.hasUppercase ? 'secondary' : 'inactive'}
                        style={styles.policyText}
                      >
                        One uppercase letter
                      </Text>
                    </View>
                    <View style={styles.policyItem}>
                      {passwordPolicy.hasNumber ? (
                        <Icon
                          name="CheckIcon"
                          size={16}
                          color={colors.success}
                          weight="fill"
                        />
                      ) : (
                        <View style={styles.policyIconUnmet} />
                      )}
                      <Text
                        size="small"
                        color={passwordPolicy.hasNumber ? 'secondary' : 'inactive'}
                        style={styles.policyText}
                      >
                        One number
                      </Text>
                    </View>
                    <View style={styles.policyItem}>
                      {passwordPolicy.hasSpecialChar ? (
                        <Icon
                          name="CheckIcon"
                          size={16}
                          color={colors.success}
                          weight="fill"
                        />
                      ) : (
                        <View style={styles.policyIconUnmet} />
                      )}
                      <Text
                        size="small"
                        color={passwordPolicy.hasSpecialChar ? 'secondary' : 'inactive'}
                        style={styles.policyText}
                      >
                        One special character
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text size="body" weight="medium" color="primary" style={styles.label}>
                  Confirm Password
                </Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.passwordInput,
                      signupFormErrors.confirmPassword && signupFormTouched.confirmPassword && styles.inputError,
                    ]}
                    placeholder="Confirm your password"
                    placeholderTextColor={colors.textInactive}
                    value={signupFormValues.confirmPassword}
                    onChangeText={(text) => {
                      handleSignupFormChange('confirmPassword')(text);
                    }}
                    onBlur={handleSignupFormBlur('confirmPassword')}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    textContentType="none"
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Icon
                      name={showConfirmPassword ? 'EyeSlashIcon' : 'EyeIcon'}
                      size={20}
                      color={colors.textSecondary}
                    />
                  </Pressable>
                </View>
                {signupFormErrors.confirmPassword && signupFormTouched.confirmPassword && (
                  <Text size="small" color="danger" style={styles.errorText}>
                    {signupFormErrors.confirmPassword}
                  </Text>
                )}
              </View>

              {/* Terms Checkbox */}
              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => {
                    setSignupFormFieldValue('acceptTerms', !signupFormValues.acceptTerms);
                    setSignupFormFieldTouched('acceptTerms', true);
                  }}
                >
                  <View
                    style={[
                      styles.checkboxBox,
                      signupFormValues.acceptTerms && styles.checkboxBoxChecked,
                    ]}
                  >
                    {signupFormValues.acceptTerms && (
                      <Icon name="CheckIcon" size={16} color={colors.background} />
                    )}
                  </View>
                  <Text size="body" color="secondary" style={styles.termsText}>
                    I agree to the Terms & Conditions
                  </Text>
                </TouchableOpacity>
                {signupFormErrors.acceptTerms && signupFormTouched.acceptTerms && (
                  <Text size="small" color="danger" style={styles.errorText}>
                    {signupFormErrors.acceptTerms}
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

              {/* Signup Button */}
              <TouchableOpacity
                style={[styles.signupButton, (isLoading || !signupFormIsValid) && styles.signupButtonDisabled]}
                onPress={() => handleSignupFormSubmit()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text size="body" weight="medium" color="primaryInverted">
                    Sign up
                  </Text>
                )}
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text size="body" color="secondary">
                  Already have an account?{' '}
                </Text>
                <Pressable onPress={onNavigateToLogin}>
                  <Text size="body" weight="medium" color="brandColor">
                    Log in
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
  checkbox: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  checkboxBox: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 4,
    borderWidth: 2,
    height: 20,
    justifyContent: 'center',
    marginRight: 12,
    width: 20,
  },
  checkboxBoxChecked: {
    backgroundColor: colors.brandYellow,
    borderColor: colors.brandYellow,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  passwordPolicyContainer: {
    marginTop: 8,
  },
  policyIconUnmet: {
    borderColor: colors.textInactive,
    borderRadius: 8,
    borderWidth: 2,
    height: 16,
    marginLeft: 2,
    marginRight: 2,
    width: 16,
  },
  policyItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  policyList: {
    gap: 6,
  },
  policyText: {
    flex: 1,
  },
  policyTitle: {
    marginBottom: 8,
  },
  scrollContent: {
    flexGrow: 1,
  },
  signupButton: {
    alignItems: 'center',
    backgroundColor: colors.brandYellow,
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 16,
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
  subtitle: {
    marginBottom: 32,
  },
  termsContainer: {
    marginBottom: 20,
  },
  termsText: {
    flex: 1,
  },
  title: {
    marginBottom: 8,
  },
});

