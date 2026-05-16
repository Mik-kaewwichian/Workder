# Workder User Mobile: Navigation Flow Diagram

The navigation is primarily driven by Auth State (`workder_auth_session` using Zustand) and Navigation Guards implemented in the `_layout.tsx` of Expo Router.

```
[ App Launch ]
      |
      v
[ RootLayout (_layout.tsx) ] --> Rehydrates Zustand State
      |
      +---- (No Session? OR Token Expired?)
      |         |
      |         +--> [ Public Stack ]
      |                 |-- /(public)/index
      |                 |-- /(public)/about
      |                 |-- /(public)/premium
      |                 |-- /(public)/safezone
      |                 |-- /(public)/work
      |                 |-- /(public)/map
      |                 |-- /(auth)/login
      |                 |-- /(auth)/register
      |
      +---- (Valid Session: Role == 'user')
      |         |
      |         +-- Profile Completed?
      |         |       |-- NO  --> [ /(user)/profile-register ] (KYC Gating)
      |         |       |-- YES --> [ User Tab Navigator ]
      |         |                       |-- /(user)/dashboard
      |         |                       |-- /(user)/notifications
      |         |                       |-- /(user)/profile-register (Hidden from tabs usually)
      |
      +---- (Valid Session: Role == 'employer')
                |
                +--> [ Employer Tab Navigator ]
                        |-- /(employer)/dashboard
                        |-- /(employer)/jobs
                        |-- /(employer)/wallet
                        |-- /(employer)/employer-map
```

## Session/Auth Rules Implemented:
1. **Invalid/Missing Token**: Automatically routes back to `/(auth)/login` if trying to access user/employer segments.
2. **KYC Profile Gating**: A user is forcibly kept inside `/profile-register` until they submit their KYC fields and it responds successfully.
3. **Role Segregation**: A user cannot access `/(employer)` URLs, and vice versa. 
