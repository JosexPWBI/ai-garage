import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function MemberProfile({ onBack }) {
  const [isEditing, setIsEditing] = useState(false)

  const [displayName, setDisplayName] =
    useState('Jose Garcia')

  const [username, setUsername] =
    useState('@josexpwbi')

  const [bio, setBio] = useState(
    'Car enthusiast, builder, and founder of Project: We Built It.'
  )

  const [profilePhoto, setProfilePhoto] =
    useState('')

  const [profileMessage, setProfileMessage] =
    useState('')

  const [currentUserId, setCurrentUserId] =
    useState('')

  const [
    selectedPublicBuild,
    setSelectedPublicBuild,
  ] = useState(null)

  const [
    selectedVehicle,
    setSelectedVehicle,
  ] = useState(null)

  const [commentText, setCommentText] =
    useState('')

  const [commentError, setCommentError] =
    useState('')

  const [replyingTo, setReplyingTo] =
    useState(null)

  const [replyText, setReplyText] =
    useState('')

  const [replyError, setReplyError] =
    useState('')

  const [savedBuilds, setSavedBuilds] =
    useState(() => {
      try {
        return (
          JSON.parse(
            localStorage.getItem(
              'pwbiSavedBuilds'
            )
          ) || []
        )
      } catch (error) {
        console.error(
          'Could not load saved builds:',
          error
        )

        return []
      }
    })

  const blockedWords = [
    'fuck',
    'fucking',
    'fucked',
    'shit',
    'bitch',
    'asshole',
    'motherfucker',
    'bullshit',
  ]

  useEffect(() => {
    async function loadMemberData() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        console.error(
          'Could not get Supabase user:',
          userError
        )
      }

      if (!user) {
        setCurrentUserId('')

        const savedProfile =
          localStorage.getItem(
            'pwbiMemberProfile'
          )

        if (savedProfile) {
          try {
            const profile =
              JSON.parse(savedProfile)

            setDisplayName(
              profile.displayName ||
                'Jose Garcia'
            )

            setUsername(
              profile.username ||
                '@josexpwbi'
            )

            setBio(
              profile.bio ||
                'Car enthusiast, builder, and founder of Project: We Built It.'
            )

            setProfilePhoto(
              profile.profilePhoto || ''
            )
          } catch (error) {
            console.error(
              'Could not load local member profile:',
              error
            )
          }
        }

        return
      }

      setCurrentUserId(
        user.id
      )

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from('profiles')
        .select(
          'display_name, username, bio, profile_photo'
        )
        .eq('id', user.id)
        .maybeSingle()

      if (profileError) {
        console.error(
          'Could not load Supabase profile:',
          profileError
        )
      }

      if (profile) {
        setDisplayName(
          profile.display_name ||
            'Jose Garcia'
        )

        setUsername(
          profile.username ||
            '@josexpwbi'
        )

        setBio(
          profile.bio ||
            'Car enthusiast, builder, and founder of Project: We Built It.'
        )

        setProfilePhoto(
          profile.profile_photo || ''
        )
      }

      let localBuilds = []

      try {
        localBuilds =
          JSON.parse(
            localStorage.getItem(
              'pwbiSavedBuilds'
            )
          ) || []
      } catch (error) {
        console.error(
          'Could not load local build extras:',
          error
        )
      }

      const {
        data: builds,
        error: buildsError,
      } = await supabase
        .from('Builds')
        .select(
          'id, user_id, year, make, model, goal, budget, notes, recommendations, is_public, created_at'
        )
        .eq('user_id', user.id)
        .order('created_at', {
          ascending: false,
        })

      if (buildsError) {
        console.error(
          'Could not load Supabase builds:',
          buildsError
        )

        return
      }

      const buildIds =
        (builds || []).map(
          (build) => build.id
        )

      let likes = []
      let favorites = []
      let comments = []
      let commentProfiles = []
      let likesLoadedFromSupabase = true
      let favoritesLoadedFromSupabase = true
      let commentsLoadedFromSupabase = true

      if (buildIds.length > 0) {
        const {
          data: likesData,
          error: likesError,
        } = await supabase
          .from('build_likes')
          .select(
            'id, build_id, user_id'
          )
          .in('build_id', buildIds)

        if (likesError) {
          console.error(
            'Could not load Supabase likes:',
            likesError
          )

          likesLoadedFromSupabase = false
        } else {
          likes = likesData || []
        }

        const {
          data: favoritesData,
          error: favoritesError,
        } = await supabase
          .from('build_favorites')
          .select(
            'id, build_id, user_id'
          )
          .in('build_id', buildIds)
          .eq('user_id', user.id)

        if (favoritesError) {
          console.error(
            'Could not load Supabase favorites:',
            favoritesError
          )

          favoritesLoadedFromSupabase = false
        } else {
          favorites =
            favoritesData || []
        }

        const {
          data: commentsData,
          error: commentsError,
        } = await supabase
          .from('comments')
          .select(
            'id, build_id, user_id, parent_comment_id, body, created_at'
          )
          .in('build_id', buildIds)
          .order('created_at', {
            ascending: true,
          })

        if (commentsError) {
          console.error(
            'Could not load Supabase comments:',
            commentsError
          )

          commentsLoadedFromSupabase = false
        } else {
          comments = commentsData || []

          const commentUserIds = [
            ...new Set(
              comments
                .map(
                  (comment) =>
                    comment.user_id
                )
                .filter(Boolean)
            ),
          ]

          if (commentUserIds.length > 0) {
            const {
              data: commentProfilesData,
              error: commentProfilesError,
            } = await supabase
              .from('profiles')
              .select(
                'id, display_name, username'
              )
              .in('id', commentUserIds)

            if (commentProfilesError) {
              console.error(
                'Could not load comment profiles:',
                commentProfilesError
              )
            } else {
              commentProfiles =
                commentProfilesData || []
            }
          }
        }
      }

      const formattedBuilds =
        (builds || []).map((build) => {
          const localMatch =
            localBuilds.find(
              (localBuild) =>
                localBuild.id ===
                build.id
            )

          const buildLikes =
            likes.filter(
              (like) =>
                like.build_id ===
                build.id
            )

          const currentUserLiked =
            buildLikes.some(
              (like) =>
                like.user_id ===
                user.id
            )

          const currentUserFavorited =
            favorites.some(
              (favorite) =>
                favorite.build_id ===
                build.id
            )

          return {
            id: build.id,
            user_id: build.user_id,
            year: build.year || '',
            make: build.make || '',
            model: build.model || '',
            goal: build.goal || '',
            budget: Number(
              build.budget || 0
            ),
            notes: build.notes || '',
            recommendations:
              build.recommendations ||
              [],
            isPublic:
              build.is_public ||
              false,
            createdAt:
              build.created_at,

            isLiked:
              likesLoadedFromSupabase
                ? currentUserLiked
                : localMatch?.isLiked ||
                  false,

            likeCount:
              likesLoadedFromSupabase
                ? buildLikes.length
                : Number(
                    localMatch?.likeCount ||
                      0
                  ),

            isFavorited:
              favoritesLoadedFromSupabase
                ? currentUserFavorited
                : localMatch?.isFavorited ||
                  false,

            comments:
              commentsLoadedFromSupabase
                ? comments
                    .filter(
                      (comment) =>
                        comment.build_id ===
                          build.id &&
                        !comment.parent_comment_id
                    )
                    .map((comment) => {
                      const commentProfile =
                        commentProfiles.find(
                          (profile) =>
                            profile.id ===
                            comment.user_id
                        )

                      const replies =
                        comments
                          .filter(
                            (reply) =>
                              reply.parent_comment_id ===
                              comment.id
                          )
                          .map((reply) => {
                            const replyProfile =
                              commentProfiles.find(
                                (profile) =>
                                  profile.id ===
                                  reply.user_id
                              )

                            return {
                              id: reply.id,
                              userId: reply.user_id,
                              author:
                                replyProfile?.display_name ||
                                'PWBI Member',
                              username:
                                replyProfile?.username ||
                                '@member',
                              text: reply.body || '',
                              createdAt:
                                reply.created_at,
                            }
                          })

                      return {
                        id: comment.id,
                        userId: comment.user_id,
                        author:
                          commentProfile?.display_name ||
                          'PWBI Member',
                        username:
                          commentProfile?.username ||
                          '@member',
                        text: comment.body || '',
                        createdAt:
                          comment.created_at,
                        replies,
                      }
                    })
                : localMatch?.comments ||
                  [],
          }
        })

      setSavedBuilds(
        formattedBuilds
      )

      try {
        localStorage.setItem(
          'pwbiSavedBuilds',
          JSON.stringify(
            formattedBuilds
          )
        )
      } catch (error) {
        console.error(
          'Could not update local build backup:',
          error
        )
      }
    }

    loadMemberData()
  }, [])

  async function handleSaveProfile() {
    setProfileMessage('')

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      console.error(
        'Could not get logged-in user:',
        userError
      )

      setProfileMessage(
        'Could not verify your account.'
      )

      return
    }

    if (!user) {
      setProfileMessage(
        'Please log in before saving your profile.'
      )

      return
    }

    const profileData = {
      id: user.id,
      display_name: displayName,
      username,
      bio,
      profile_photo: profilePhoto,
    }

    const {
      error: profileError,
    } = await supabase
      .from('profiles')
      .upsert(profileData, {
        onConflict: 'id',
      })

    if (profileError) {
      console.error(
        'Could not save Supabase profile:',
        profileError
      )

      setProfileMessage(
        `Could not save profile: ${profileError.message}`
      )

      return
    }

    try {
      localStorage.setItem(
        'pwbiMemberProfile',
        JSON.stringify({
          displayName,
          username,
          bio,
          profilePhoto,
        })
      )
    } catch (error) {
      console.error(
        'Could not save local profile backup:',
        error
      )
    }

    setProfileMessage(
      'Profile saved successfully.'
    )

    setIsEditing(false)
  }

  function handleProfilePhotoChange(e) {
    const file = e.target.files[0]

    if (
      !file ||
      !file.type.startsWith('image/')
    ) {
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const img = new Image()

      img.onload = () => {
        const canvas =
          document.createElement('canvas')

        const size = 300

        canvas.width = size
        canvas.height = size

        const ctx =
          canvas.getContext('2d')

        const sourceSize = Math.min(
          img.width,
          img.height
        )

        const sourceX =
          (img.width - sourceSize) / 2

        const sourceY =
          (img.height - sourceSize) / 2

        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceSize,
          sourceSize,
          0,
          0,
          size,
          size
        )

        const compressedPhoto =
          canvas.toDataURL(
            'image/jpeg',
            0.75
          )

        setProfilePhoto(
          compressedPhoto
        )
      }

      img.src = reader.result
    }

    reader.readAsDataURL(file)
  }

  function updateSavedBuilds(
    updatedBuilds
  ) {
    localStorage.setItem(
      'pwbiSavedBuilds',
      JSON.stringify(updatedBuilds)
    )

    setSavedBuilds(updatedBuilds)
  }

  function getBuildId(build, index) {
    return build.id || index + 1
  }

  function containsProfanity(text) {
    return blockedWords.some(
      (word) => {
        const pattern =
          new RegExp(
            `\\b${word}\\b`,
            'i'
          )

        return pattern.test(text)
      }
    )
  }

  function syncSelectedPublicBuild(
    updatedBuilds,
    buildId
  ) {
    const updatedSelectedBuild =
      updatedBuilds.find(
        (build, index) =>
          getBuildId(
            build,
            index
          ) === buildId
      )

    if (updatedSelectedBuild) {
      setSelectedPublicBuild(
        (currentBuild) => ({
          ...currentBuild,
          ...updatedSelectedBuild,
          id: buildId,

          recommendations:
            updatedSelectedBuild
              .recommendations || [],

          comments:
            updatedSelectedBuild
              .comments || [],

          likeCount: Number(
            updatedSelectedBuild
              .likeCount || 0
          ),

          isLiked:
            updatedSelectedBuild
              .isLiked || false,

          isFavorited:
            updatedSelectedBuild
              .isFavorited || false,
        })
      )
    }
  }

  async function toggleBuildPublic(buildId) {
    const currentBuild =
      savedBuilds.find(
        (build, index) =>
          getBuildId(
            build,
            index
          ) === buildId
      )

    if (!currentBuild) {
      return
    }

    const nextPublicStatus =
      !currentBuild.isPublic

    const {
      error: updateError,
    } = await supabase
      .from('Builds')
      .update({
        is_public:
          nextPublicStatus,
      })
      .eq('id', buildId)

    if (updateError) {
      console.error(
        'Could not update build visibility:',
        updateError
      )

      setProfileMessage(
        `Could not update build visibility: ${updateError.message}`
      )

      return
    }

    const updatedBuilds =
      savedBuilds.map(
        (build, index) =>
          getBuildId(
            build,
            index
          ) === buildId
            ? {
                ...build,
                isPublic:
                  nextPublicStatus,
              }
            : build
      )

    updateSavedBuilds(
      updatedBuilds
    )

    setProfileMessage(
      nextPublicStatus
        ? 'Build is now public.'
        : 'Build is now private.'
    )
  }

  async function toggleBuildLike(buildId) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error(
        'Could not verify user for like:',
        userError
      )

      setProfileMessage(
        'Please log in before liking a build.'
      )

      return
    }

    const currentBuild =
      savedBuilds.find(
        (build, index) =>
          getBuildId(
            build,
            index
          ) === buildId
      )

    if (!currentBuild) {
      return
    }

    if (currentBuild.isLiked) {
      const {
        error: deleteError,
      } = await supabase
        .from('build_likes')
        .delete()
        .eq('build_id', buildId)
        .eq('user_id', user.id)

      if (deleteError) {
        console.error(
          'Could not remove Supabase like:',
          deleteError
        )

        setProfileMessage(
          `Could not remove like: ${deleteError.message}`
        )

        return
      }
    } else {
      const {
        error: insertError,
      } = await supabase
        .from('build_likes')
        .insert({
          build_id: buildId,
          user_id: user.id,
        })

      if (insertError) {
        console.error(
          'Could not save Supabase like:',
          insertError
        )

        setProfileMessage(
          `Could not save like: ${insertError.message}`
        )

        return
      }
    }

    const updatedBuilds =
      savedBuilds.map(
        (build, index) => {
          const currentId =
            getBuildId(
              build,
              index
            )

          if (
            currentId !== buildId
          ) {
            return build
          }

          const wasLiked =
            build.isLiked || false

          const currentLikeCount =
            Number(
              build.likeCount || 0
            )

          return {
            ...build,

            isLiked: !wasLiked,

            likeCount: wasLiked
              ? Math.max(
                  0,
                  currentLikeCount - 1
                )
              : currentLikeCount + 1,
          }
        }
      )

    updateSavedBuilds(
      updatedBuilds
    )

    syncSelectedPublicBuild(
      updatedBuilds,
      buildId
    )

    setProfileMessage('')
  }

  async function toggleBuildFavorite(
    buildId
  ) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error(
        'Could not verify user for favorite:',
        userError
      )

      setProfileMessage(
        'Please log in before favoriting a build.'
      )

      return
    }

    const currentBuild =
      savedBuilds.find(
        (build, index) =>
          getBuildId(
            build,
            index
          ) === buildId
      )

    if (!currentBuild) {
      return
    }

    if (currentBuild.isFavorited) {
      const {
        error: deleteError,
      } = await supabase
        .from('build_favorites')
        .delete()
        .eq('build_id', buildId)
        .eq('user_id', user.id)

      if (deleteError) {
        console.error(
          'Could not remove Supabase favorite:',
          deleteError
        )

        setProfileMessage(
          `Could not remove favorite: ${deleteError.message}`
        )

        return
      }
    } else {
      const {
        error: insertError,
      } = await supabase
        .from('build_favorites')
        .insert({
          build_id: buildId,
          user_id: user.id,
        })

      if (insertError) {
        console.error(
          'Could not save Supabase favorite:',
          insertError
        )

        setProfileMessage(
          `Could not save favorite: ${insertError.message}`
        )

        return
      }
    }

    const updatedBuilds =
      savedBuilds.map(
        (build, index) =>
          getBuildId(
            build,
            index
          ) === buildId
            ? {
                ...build,
                isFavorited:
                  !build.isFavorited,
              }
            : build
      )

    updateSavedBuilds(
      updatedBuilds
    )

    syncSelectedPublicBuild(
      updatedBuilds,
      buildId
    )

    setProfileMessage('')
  }

  async function addComment(buildId) {
    const cleanComment =
      commentText.trim()

    if (!cleanComment) {
      setCommentError(
        'Please enter a comment before posting.'
      )

      return
    }

    if (
      containsProfanity(
        cleanComment
      )
    ) {
      setCommentError(
        'Please remove profanity before posting.'
      )

      return
    }

    setCommentError('')

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setCommentError(
        'Please log in before posting a comment.'
      )

      return
    }

    const {
      data: newCommentRow,
      error: insertError,
    } = await supabase
      .from('comments')
      .insert({
        build_id: buildId,
        user_id: user.id,
        parent_comment_id: null,
        body: cleanComment,
      })
      .select(
        'id, build_id, user_id, parent_comment_id, body, created_at'
      )
      .single()

    if (insertError) {
      console.error(
        'Could not save comment:',
        insertError
      )

      setCommentError(
        `Could not post comment: ${insertError.message}`
      )

      return
    }

    const newComment = {
      id: newCommentRow.id,
      userId: newCommentRow.user_id,
      author: displayName,
      username,
      text: newCommentRow.body,
      createdAt:
        newCommentRow.created_at,
      replies: [],
    }

    const updatedBuilds =
      savedBuilds.map(
        (build, index) => {
          const currentId =
            getBuildId(
              build,
              index
            )

          if (
            currentId !== buildId
          ) {
            return build
          }

          return {
            ...build,

            comments: [
              ...(build.comments ||
                []),

              newComment,
            ],
          }
        }
      )

    updateSavedBuilds(
      updatedBuilds
    )

    syncSelectedPublicBuild(
      updatedBuilds,
      buildId
    )

    setCommentText('')
  }

  async function deleteComment(
    buildId,
    commentId
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return
    }

    const {
      error: repliesDeleteError,
    } = await supabase
      .from('comments')
      .delete()
      .eq(
        'parent_comment_id',
        commentId
      )
      .eq('user_id', user.id)

    if (repliesDeleteError) {
      console.error(
        'Could not delete comment replies:',
        repliesDeleteError
      )
    }

    const {
      error: deleteError,
    } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error(
        'Could not delete comment:',
        deleteError
      )

      return
    }

    const updatedBuilds =
      savedBuilds.map(
        (build, index) => {
          const currentId =
            getBuildId(
              build,
              index
            )

          if (
            currentId !== buildId
          ) {
            return build
          }

          return {
            ...build,

            comments: (
              build.comments || []
            ).filter(
              (comment) =>
                comment.id !==
                commentId
            ),
          }
        }
      )

    updateSavedBuilds(
      updatedBuilds
    )

    syncSelectedPublicBuild(
      updatedBuilds,
      buildId
    )
  }

  async function addReply(
    buildId,
    commentId
  ) {
    const cleanReply =
      replyText.trim()

    if (!cleanReply) {
      setReplyError(
        'Please enter a reply before posting.'
      )

      return
    }

    if (
      containsProfanity(
        cleanReply
      )
    ) {
      setReplyError(
        'Please remove profanity before posting.'
      )

      return
    }

    setReplyError('')

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setReplyError(
        'Please log in before posting a reply.'
      )

      return
    }

    const {
      data: newReplyRow,
      error: insertError,
    } = await supabase
      .from('comments')
      .insert({
        build_id: buildId,
        user_id: user.id,
        parent_comment_id:
          commentId,
        body: cleanReply,
      })
      .select(
        'id, build_id, user_id, parent_comment_id, body, created_at'
      )
      .single()

    if (insertError) {
      console.error(
        'Could not save reply:',
        insertError
      )

      setReplyError(
        `Could not post reply: ${insertError.message}`
      )

      return
    }

    const newReply = {
      id: newReplyRow.id,
      userId: newReplyRow.user_id,
      author: displayName,
      username,
      text: newReplyRow.body,
      createdAt:
        newReplyRow.created_at,
    }

    const updatedBuilds =
      savedBuilds.map(
        (build, index) => {
          const currentId =
            getBuildId(
              build,
              index
            )

          if (
            currentId !== buildId
          ) {
            return build
          }

          return {
            ...build,

            comments: (
              build.comments || []
            ).map(
              (comment) =>
                comment.id ===
                commentId
                  ? {
                      ...comment,

                      replies: [
                        ...(comment.replies ||
                          []),

                        newReply,
                      ],
                    }
                  : comment
            ),
          }
        }
      )

    updateSavedBuilds(
      updatedBuilds
    )

    syncSelectedPublicBuild(
      updatedBuilds,
      buildId
    )

    setReplyingTo(null)
    setReplyText('')
  }

  async function deleteReply(
    buildId,
    commentId,
    replyId
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return
    }

    const {
      error: deleteError,
    } = await supabase
      .from('comments')
      .delete()
      .eq('id', replyId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error(
        'Could not delete reply:',
        deleteError
      )

      return
    }

    const updatedBuilds =
      savedBuilds.map(
        (build, index) => {
          const currentId =
            getBuildId(
              build,
              index
            )

          if (
            currentId !== buildId
          ) {
            return build
          }

          return {
            ...build,

            comments: (
              build.comments || []
            ).map(
              (comment) =>
                comment.id ===
                commentId
                  ? {
                      ...comment,

                      replies: (
                        comment.replies ||
                        []
                      ).filter(
                        (reply) =>
                          reply.id !==
                          replyId
                      ),
                    }
                  : comment
            ),
          }
        }
      )

    updateSavedBuilds(
      updatedBuilds
    )

    syncSelectedPublicBuild(
      updatedBuilds,
      buildId
    )
  }

  const vehicles =
    savedBuilds.map(
      (build, index) => ({
        id: getBuildId(
          build,
          index
        ),

        year:
          build.year || '',

        make:
          build.make || '',

        model:
          build.model || '',

        goal:
          build.goal || '',

        budget:
          build.budget || 0,

        notes:
          build.notes || '',

        recommendations:
          build.recommendations || [],

        status:
          index === 0
            ? 'Active Build'
            : 'Saved Build',

        isPublic:
          build.isPublic || false,

        isLiked:
          build.isLiked || false,

        likeCount:
          Number(
            build.likeCount || 0
          ),

        isFavorited:
          build.isFavorited ||
          false,

        comments:
          build.comments || [],
      })
    )

  const publicBuilds =
    vehicles.filter(
      (vehicle) =>
        vehicle.isPublic
    )

  const favoriteBuilds =
    publicBuilds.filter(
      (vehicle) =>
        vehicle.isFavorited
    )

  const activity =
    savedBuilds.map((build) => {
      const vehicleName =
        `${build.year || ''} ${
          build.make || ''
        } ${
          build.model || ''
        }`.trim()

      return vehicleName
        ? `Saved ${vehicleName} to My Garage.`
        : 'Saved a build to My Garage.'
    })

  const member = {
    displayName,
    username,
    bio,

    vehicles:
      vehicles.length,

    publicBuilds:
      publicBuilds.length,

    savedBuilds:
      vehicles.filter(
        (vehicle) =>
          vehicle.status ===
          'Saved Build'
      ).length,

    activityCount:
      activity.length,
  }

  if (selectedVehicle) {
    return (
      <main className="member-profile">
        <section className="garage-section">
          <p className="form-kicker">
            MY VEHICLE
          </p>

          <h1>
            {selectedVehicle.year}{' '}
            {selectedVehicle.make}{' '}
            {selectedVehicle.model}
          </h1>

          <div className="member-stats">
            <div className="member-stat-card">
              <span>
                {selectedVehicle.goal ||
                  'Not Set'}
              </span>

              <p>Build Goal</p>
            </div>

            <div className="member-stat-card">
              <span>
                $
                {Number(
                  selectedVehicle.budget ||
                    0
                ).toLocaleString()}
              </span>

              <p>Budget</p>
            </div>
          </div>

          <div className="member-empty-card">
            <p className="form-kicker">
              AI GARAGE PLAN
            </p>

            {selectedVehicle
              .recommendations
              .length > 0 ? (
              selectedVehicle.recommendations.map(
                (
                  recommendation,
                  index
                ) => (
                  <div
                    className="member-activity-item"
                    key={index}
                  >
                    <span className="activity-dot"></span>

                    <p>
                      {recommendation.recommendation ||
                        recommendation.name ||
                        `Recommendation ${
                          index + 1
                        }`}
                    </p>
                  </div>
                )
              )
            ) : (
              <p>
                No recommendations
                saved for this build
                yet.
              </p>
            )}
          </div>

          <button
            type="button"
            className="garage-back-button"
            onClick={() =>
              setSelectedVehicle(
                null
              )
            }
          >
            Back to Member Profile
          </button>
        </section>
      </main>
    )
  }

  if (selectedPublicBuild) {
    return (
      <main className="member-profile">
        <section className="garage-section">
          <p className="form-kicker">
            PUBLIC BUILD
          </p>

          <h1>
            {selectedPublicBuild.year}{' '}
            {selectedPublicBuild.make}{' '}
            {selectedPublicBuild.model}
          </h1>

          <p>
            This build is shared
            with the PWBI community.
          </p>

          <div className="member-empty-card">
            <p className="form-kicker">
              SHARED BY
            </p>

            <h3>
              {displayName}
            </h3>

            <p className="member-username">
              {username}
            </p>
          </div>

          <div className="member-stats">
            <div className="member-stat-card">
              <span>
                {selectedPublicBuild.goal ||
                  'Not Set'}
              </span>

              <p>Build Goal</p>
            </div>

            <div className="member-stat-card">
              <span>
                $
                {Number(
                  selectedPublicBuild.budget ||
                    0
                ).toLocaleString()}
              </span>

              <p>Budget</p>
            </div>
          </div>

          <div className="member-empty-card">
            <button
              type="button"
              className="auth-button"
              onClick={() =>
                toggleBuildLike(
                  selectedPublicBuild.id
                )
              }
            >
              {selectedPublicBuild.isLiked
                ? 'Unlike'
                : 'Like'}{' '}
              ·{' '}
              {selectedPublicBuild.likeCount ||
                0}
            </button>

            <button
              type="button"
              className="auth-button secondary"
              onClick={() =>
                toggleBuildFavorite(
                  selectedPublicBuild.id
                )
              }
            >
              {selectedPublicBuild.isFavorited
                ? 'Remove Favorite'
                : 'Favorite Build'}
            </button>
          </div>

          <div className="member-empty-card">
            <p className="form-kicker">
              AI GARAGE PLAN
            </p>

            {selectedPublicBuild
              .recommendations
              .length > 0 ? (
              selectedPublicBuild.recommendations.map(
                (
                  recommendation,
                  index
                ) => (
                  <div
                    className="member-activity-item"
                    key={index}
                  >
                    <span className="activity-dot"></span>

                    <p>
                      {recommendation.recommendation ||
                        recommendation.name ||
                        `Recommendation ${
                          index + 1
                        }`}
                    </p>
                  </div>
                )
              )
            ) : (
              <p>
                No recommendations
                saved for this build
                yet.
              </p>
            )}
          </div>

          <div className="member-empty-card">
            <p className="form-kicker">
              COMMENTS
            </p>

            <textarea
              value={commentText}
              onChange={(e) => {
                setCommentText(
                  e.target.value
                )

                if (
                  commentError
                ) {
                  setCommentError(
                    ''
                  )
                }
              }}
              placeholder="Add a comment..."
              rows="3"
            />

            {commentError && (
              <p className="member-comment-error">
                {commentError}
              </p>
            )}

            <button
              type="button"
              className="auth-button"
              onClick={() =>
                addComment(
                  selectedPublicBuild.id
                )
              }
            >
              Post Comment
            </button>
          </div>

          <div className="member-activity-list">
            {selectedPublicBuild
              .comments.length >
            0 ? (
              selectedPublicBuild.comments.map(
                (comment) => (
                  <div
                    className="member-activity-item"
                    key={
                      comment.id
                    }
                  >
                    <span className="activity-dot"></span>

                    <div>
                      <strong>
                        {
                          comment.author
                        }
                      </strong>

                      <p className="member-username">
                        {
                          comment.username
                        }
                      </p>

                      <p>
                        {
                          comment.text
                        }
                      </p>

                      <p className="member-comment-time">
                        {comment.createdAt
                          ? new Date(
                              comment.createdAt
                            ).toLocaleString()
                          : 'Time unavailable'}
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setReplyingTo(
                            comment.id
                          )

                          setReplyText(
                            ''
                          )

                          setReplyError(
                            ''
                          )
                        }}
                      >
                        Reply
                      </button>

                      {comment.userId ===
                        currentUserId && (

                        <button
                          type="button"
                          onClick={() =>
                            deleteComment(
                              selectedPublicBuild.id,
                              comment.id
                            )
                          }
                        >
                          Delete Comment
                        </button>
                      )}

                      {replyingTo ===
                        comment.id && (
                        <div className="member-empty-card">
                          <textarea
                            value={
                              replyText
                            }
                            onChange={(
                              e
                            ) => {
                              setReplyText(
                                e.target.value
                              )

                              if (
                                replyError
                              ) {
                                setReplyError(
                                  ''
                                )
                              }
                            }}
                            placeholder="Write a reply..."
                            rows="2"
                          />

                          {replyError && (
                            <p className="member-comment-error">
                              {
                                replyError
                              }
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              addReply(
                                selectedPublicBuild.id,
                                comment.id
                              )
                            }
                          >
                            Post Reply
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setReplyingTo(
                                null
                              )

                              setReplyText(
                                ''
                              )

                              setReplyError(
                                ''
                              )
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      {(comment.replies ||
                        []).length >
                        0 && (
                        <div className="member-activity-list">
                          {comment.replies.map(
                            (
                              reply
                            ) => (
                              <div
                                className="member-activity-item"
                                key={
                                  reply.id
                                }
                              >
                                <span className="activity-dot"></span>

                                <div>
                                  <strong>
                                    {
                                      reply.author
                                    }
                                  </strong>

                                  <p className="member-username">
                                    {
                                      reply.username
                                    }
                                  </p>

                                  <p>
                                    {
                                      reply.text
                                    }
                                  </p>

                                  <p className="member-comment-time">
                                    {reply.createdAt
                                      ? new Date(
                                          reply.createdAt
                                        ).toLocaleString()
                                      : 'Time unavailable'}
                                  </p>

                                  {reply.userId ===
                                    currentUserId && (

                                    <button
                                      type="button"
                                      onClick={() =>
                                        deleteReply(
                                          selectedPublicBuild.id,
                                          comment.id,
                                          reply.id
                                        )
                                      }
                                    >
                                      Delete Reply
                                    </button>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="member-empty-card">
                <p>
                  No comments yet.
                </p>

                <p>
                  Be the first to
                  comment on this
                  build.
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            className="garage-back-button"
            onClick={() => {
              setSelectedPublicBuild(
                null
              )

              setCommentText('')
              setCommentError('')
              setReplyingTo(null)
              setReplyText('')
              setReplyError('')
            }}
          >
            Back to Member Profile
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="member-profile">
      <div className="member-profile-header">
        <div className="member-avatar">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
            />
          ) : (
            <span>JG</span>
          )}
        </div>

        <div className="member-profile-info">
          <p className="form-kicker">
            PWBI MEMBER PROFILE
          </p>

          {isEditing ? (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={
                  handleProfilePhotoChange
                }
              />

              <input
                type="text"
                value={
                  displayName
                }
                onChange={(e) =>
                  setDisplayName(
                    e.target.value
                  )
                }
                placeholder="Display name"
              />

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                  )
                }
                placeholder="@username"
              />

              <textarea
                value={bio}
                onChange={(e) =>
                  setBio(
                    e.target.value
                  )
                }
                placeholder="Tell the community about yourself"
                rows="3"
              />
            </>
          ) : (
            <>
              <h1>
                {displayName}
              </h1>

              <p className="member-username">
                {username}
              </p>

              <p className="member-bio">
                {bio}
              </p>
            </>
          )}

          {profileMessage && (
            <p>
              {profileMessage}
            </p>
          )}

          <button
            type="button"
            className="auth-button"
            onClick={() => {
              if (isEditing) {
                handleSaveProfile()
              } else {
                setProfileMessage(
                  ''
                )

                setIsEditing(true)
              }
            }}
          >
            {isEditing
              ? 'Save Profile'
              : 'Edit Profile'}
          </button>
        </div>

        <button
          type="button"
          className="garage-back-button"
          onClick={onBack}
        >
          Back to AI Garage
        </button>
      </div>

      <section className="member-stats">
        <div className="member-stat-card">
          <span>
            {member.vehicles}
          </span>

          <p>Vehicles</p>
        </div>

        <div className="member-stat-card">
          <span>
            {
              member.publicBuilds
            }
          </span>

          <p>Public Builds</p>
        </div>

        <div className="member-stat-card">
          <span>
            {
              member.savedBuilds
            }
          </span>

          <p>Saved Builds</p>
        </div>

        <div className="member-stat-card">
          <span>
            {
              member.activityCount
            }
          </span>

          <p>Activity</p>
        </div>
      </section>

      <section className="garage-section">
        <div className="garage-section-heading">
          <div>
            <p className="form-kicker">
              VEHICLES
            </p>

            <h2>
              My Vehicles
            </h2>
          </div>
        </div>

        <div className="saved-build-grid">
          {vehicles.length >
          0 ? (
            vehicles.map(
              (vehicle) => (
                <div
                  className="saved-build-card"
                  key={
                    vehicle.id
                  }
                >
                  <p className="saved-build-goal">
                    {
                      vehicle.status
                    }
                  </p>

                  <h3>
                    {
                      vehicle.year
                    }{' '}
                    {
                      vehicle.make
                    }{' '}
                    {
                      vehicle.model
                    }
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedVehicle(
                        vehicle
                      )
                    }
                  >
                    View Vehicle
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      toggleBuildPublic(
                        vehicle.id
                      )
                    }
                  >
                    {vehicle.isPublic
                      ? 'Make Private'
                      : 'Make Public'}
                  </button>
                </div>
              )
            )
          ) : (
            <div className="member-empty-card">
              <p>
                No vehicles yet.
              </p>

              <p>
                Save a build in My
                Garage to add it to
                your profile.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="garage-section">
        <p className="form-kicker">
          COMMUNITY FEED
        </p>

        <h2>
          Public Builds
        </h2>

        <div className="saved-build-grid">
          {publicBuilds.length >
          0 ? (
            publicBuilds.map(
              (vehicle) => (
                <div
                  className="saved-build-card"
                  key={
                    vehicle.id
                  }
                >
                  <p className="saved-build-goal">
                    PUBLIC BUILD
                  </p>

                  <h3>
                    {
                      vehicle.year
                    }{' '}
                    {
                      vehicle.make
                    }{' '}
                    {
                      vehicle.model
                    }
                  </h3>

                  <p>
                    Shared by{' '}
                    {username}
                  </p>

                  <p>
                    {
                      vehicle.likeCount
                    }{' '}
                    Likes
                  </p>

                  <p>
                    {
                      vehicle.comments
                        .length
                    }{' '}
                    Comments
                  </p>

                  <p>
                    {vehicle.isFavorited
                      ? '★ Favorited'
                      : '☆ Not Favorited'}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPublicBuild(
                        vehicle
                      )

                      setCommentError(
                        ''
                      )
                    }}
                  >
                    View Public Build
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      toggleBuildFavorite(
                        vehicle.id
                      )
                    }
                  >
                    {vehicle.isFavorited
                      ? 'Remove Favorite'
                      : 'Favorite Build'}
                  </button>
                </div>
              )
            )
          ) : (
            <div className="member-empty-card">
              <p>
                No public builds yet.
              </p>

              <p>
                Make one of your
                vehicles public to add
                it to the community
                feed.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="garage-section">
        <p className="form-kicker">
          FAVORITES
        </p>

        <h2>
          Saved Community Builds
        </h2>

        <div className="saved-build-grid">
          {favoriteBuilds.length >
          0 ? (
            favoriteBuilds.map(
              (vehicle) => (
                <div
                  className="saved-build-card"
                  key={
                    vehicle.id
                  }
                >
                  <p className="saved-build-goal">
                    FAVORITE BUILD
                  </p>

                  <h3>
                    {
                      vehicle.year
                    }{' '}
                    {
                      vehicle.make
                    }{' '}
                    {
                      vehicle.model
                    }
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPublicBuild(
                        vehicle
                      )
                    }
                  >
                    View Favorite
                  </button>
                </div>
              )
            )
          ) : (
            <div className="member-empty-card">
              <p>
                No favorite builds
                yet.
              </p>

              <p>
                Favorite a public
                build and it will
                appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="garage-section">
        <p className="form-kicker">
          RECENT ACTIVITY
        </p>

        <h2>
          Activity
        </h2>

        <div className="member-activity-list">
          {activity.length >
          0 ? (
            activity.map(
              (
                item,
                index
              ) => (
                <div
                  className="member-activity-item"
                  key={index}
                >
                  <span className="activity-dot"></span>

                  <p>
                    {item}
                  </p>
                </div>
              )
            )
          ) : (
            <div className="member-empty-card">
              <p>
                No recent activity
                yet.
              </p>

              <p>
                Your saved builds
                will appear here as
                activity.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}