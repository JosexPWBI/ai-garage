"""Procedural build of the original PWBI sci-fi garage environment.
Run headless: blender --background --python scripts/build_garage_env.py
Outputs: public/models/garage-environment-draft.glb (staging, not wired into the site yet)
"""
import bpy
import math
import os

ROOM_W = 12.0
ROOM_D = 14.0
ROOM_H = 5.0

DARK_METAL = (0.03, 0.035, 0.04, 1.0)
PLATFORM_METAL = (0.08, 0.09, 0.10, 1.0)
TEAL = (0.0, 0.85, 0.80, 1.0)
WORKSTATION_METAL = (0.05, 0.05, 0.06, 1.0)


def reset_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for block_coll in (bpy.data.meshes, bpy.data.materials, bpy.data.lights):
        for block in list(block_coll):
            if block.users == 0:
                block_coll.remove(block)


def make_material(name, color, emission=0.0, metallic=0.6, roughness=0.35):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = color
    bsdf.inputs['Metallic'].default_value = metallic
    bsdf.inputs['Roughness'].default_value = roughness
    if emission > 0.0:
        bsdf.inputs['Emission Color'].default_value = color
        bsdf.inputs['Emission Strength'].default_value = emission
    return mat


def add_box(name, size, loc, mat):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(scale=True)
    obj.data.materials.append(mat)
    return obj


def add_cylinder(name, radius, depth, loc, mat, vertices=48):
    bpy.ops.mesh.primitive_cylinder_add(
        radius=radius, depth=depth, vertices=vertices, location=loc)
    obj = bpy.context.active_object
    obj.name = name
    obj.data.materials.append(mat)
    return obj


def build_shell(dark_metal_mat):
    add_box('Floor', (ROOM_W, ROOM_D, 0.2), (0, 0, -0.1), dark_metal_mat)
    add_box('Ceiling', (ROOM_W, ROOM_D, 0.2), (0, 0, ROOM_H + 0.1), dark_metal_mat)
    add_box('WallBack', (ROOM_W, 0.2, ROOM_H), (0, ROOM_D / 2, ROOM_H / 2), dark_metal_mat)
    add_box('WallLeft', (0.2, ROOM_D, ROOM_H), (-ROOM_W / 2, 0, ROOM_H / 2), dark_metal_mat)
    add_box('WallRight', (0.2, ROOM_D, ROOM_H), (ROOM_W / 2, 0, ROOM_H / 2), dark_metal_mat)


def build_teal_accents(teal_mat):
    strip_h = 0.08
    for z in (1.4, 3.2):
        add_box('AccentStripBack_%.1f' % z, (ROOM_W - 1.0, 0.05, strip_h),
                (0, ROOM_D / 2 - 0.08, z), teal_mat)
        add_box('AccentStripLeft_%.1f' % z, (0.05, ROOM_D - 1.0, strip_h),
                (-ROOM_W / 2 + 0.08, 0, z), teal_mat)
        add_box('AccentStripRight_%.1f' % z, (0.05, ROOM_D - 1.0, strip_h),
                (ROOM_W / 2 - 0.08, 0, z), teal_mat)
    add_cylinder('PlatformRing', radius=3.1, depth=0.06,
                 loc=(0, -1.0, 0.16), mat=teal_mat, vertices=64)


def build_platform(platform_mat):
    add_cylinder('VehiclePlatform', radius=3.0, depth=0.3, loc=(0, -1.0, 0.15),
                 mat=platform_mat, vertices=64)


def build_bay_lighting():
    positions = [(-3.5, -1.5), (0, -1.5), (3.5, -1.5), (-3.5, 3.0), (3.5, 3.0)]
    for i, (x, y) in enumerate(positions):
        light_data = bpy.data.lights.new(name='BayLight_%d' % i, type='AREA')
        light_data.shape = 'RECTANGLE'
        light_data.size = 1.8
        light_data.size_y = 0.4
        light_data.energy = 400.0
        light_data.color = (0.95, 0.97, 1.0)
        light_obj = bpy.data.objects.new('BayLight_%d' % i, light_data)
        light_obj.location = (x, y, ROOM_H - 0.15)
        light_obj.rotation_euler = (0, 0, 0)
        bpy.context.collection.objects.link(light_obj)

    key = bpy.data.lights.new(name='KeyFill', type='SUN')
    key.energy = 1.2
    key_obj = bpy.data.objects.new('KeyFill', key)
    key_obj.location = (0, -6, 6)
    key_obj.rotation_euler = (math.radians(55), 0, math.radians(20))
    bpy.context.collection.objects.link(key_obj)


def build_workstation(metal_mat, teal_mat):
    ox, oy = (4.6, 5.2)
    add_box('WorkDesk', (1.8, 0.7, 0.75), (ox, oy, 0.375), metal_mat)
    add_box('WorkDeskLegL', (0.08, 0.6, 0.75), (ox - 0.8, oy, 0.375), metal_mat)
    add_box('WorkDeskLegR', (0.08, 0.6, 0.75), (ox + 0.8, oy, 0.375), metal_mat)
    add_box('MonitorStand', (0.1, 0.1, 0.3), (ox, oy - 0.2, 0.9), metal_mat)
    add_box('Monitor', (1.0, 0.06, 0.55), (ox, oy - 0.2, 1.3), metal_mat)
    add_box('MonitorScreen', (0.92, 0.02, 0.48), (ox, oy - 0.23, 1.3), teal_mat)
    bpy.ops.mesh.primitive_torus_add(
        major_radius=0.35, minor_radius=0.02, location=(ox, oy - 0.2, 1.3))
    ring = bpy.context.active_object
    ring.name = 'KaizenRing'
    ring.rotation_euler = (math.radians(90), 0, 0)
    ring.data.materials.append(teal_mat)
    add_cylinder('StoolSeat', radius=0.25, depth=0.06, loc=(ox, oy + 0.9, 0.5), mat=metal_mat)
    add_cylinder('StoolPost', radius=0.04, depth=0.5, loc=(ox, oy + 0.9, 0.25), mat=metal_mat)


def set_render_defaults():
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE_NEXT' if hasattr(bpy.types, 'SceneEEVEE') else 'BLENDER_EEVEE'
    world = bpy.data.worlds.get('World') or bpy.data.worlds.new('World')
    scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes.get('Background')
    if bg:
        bg.inputs[0].default_value = (0.01, 0.012, 0.014, 1.0)
        bg.inputs[1].default_value = 0.15


def export_glb(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_yup=True,
    )


def add_camera_and_render(out_png):
    import mathutils
    cam_data = bpy.data.cameras.new('PreviewCam')
    cam_data.lens = 20
    cam_obj = bpy.data.objects.new('PreviewCam', cam_data)
    cam_obj.location = (3.0, -14.0, 4.6)
    bpy.context.collection.objects.link(cam_obj)
    target = mathutils.Vector((1.5, 2.0, 1.8))
    direction = target - cam_obj.location
    cam_obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()
    bpy.context.scene.camera = cam_obj
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'CPU'
    scene.cycles.samples = 32
    scene.cycles.use_denoising = False
    for layer in scene.view_layers:
        layer.cycles.use_denoising = False
    scene.render.resolution_x = 960
    scene.render.resolution_y = 640
    scene.render.filepath = out_png
    bpy.ops.render.render(write_still=True)


def main():
    reset_scene()
    dark_metal = make_material('DarkMetal', DARK_METAL, metallic=0.7, roughness=0.4)
    platform_metal = make_material('PlatformMetal', PLATFORM_METAL, metallic=0.75, roughness=0.3)
    teal = make_material('TealAccent', TEAL, emission=3.5, metallic=0.0, roughness=0.2)
    workstation_metal = make_material('WorkstationMetal', WORKSTATION_METAL, metallic=0.6, roughness=0.35)

    build_shell(dark_metal)
    build_teal_accents(teal)
    build_platform(platform_metal)
    build_bay_lighting()
    build_workstation(workstation_metal, teal)
    set_render_defaults()

    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_path = os.path.join(root, 'public', 'models', 'garage-environment-draft.glb')
    export_glb(out_path)
    print('EXPORTED:', out_path)

    preview_path = os.path.join(root, 'scripts', 'garage-preview.png')
    add_camera_and_render(preview_path)
    print('RENDERED:', preview_path)


if __name__ == '__main__':
    main()
